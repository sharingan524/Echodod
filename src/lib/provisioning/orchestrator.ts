/**
 * Provisioning Orchestrator
 * Builds and executes provisioning plans based on purchased tier.
 *
 * Design: Each step is executed sequentially. On failure, the pipeline
 * stops and the admin can retry from the failed step or fall back to
 * manual provisioning. All state is persisted in the ImplementationTicket.
 */

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { sendImplementationCompleteNotification } from "@/lib/email";
import { getClientConfig } from "@/lib/aws/credentials";
import { getConnectSteps, executeConnectStep } from "./connect";
import { getSesSteps, executeSesStep } from "./ses";
import { getPinpointSteps, executePinpointStep } from "./pinpoint";
import {
  TIER_SERVICES,
  type ProvisioningStep,
  type ProvisioningPlan,
} from "./types";
import type { AwsClientConfig } from "@/lib/aws/credentials";

/** Build a provisioning plan based on the purchased tier */
export function buildProvisioningPlan(params: {
  organizationId: string;
  ticketId: string;
  tier: string;
}): ProvisioningPlan {
  const services = TIER_SERVICES[params.tier] || TIER_SERVICES.basic;
  const steps: ProvisioningStep[] = [];

  for (const service of services) {
    switch (service) {
      case "connect":
        steps.push(...getConnectSteps());
        break;
      case "ses":
        steps.push(...getSesSteps());
        break;
      case "pinpoint":
        steps.push(...getPinpointSteps());
        break;
    }
  }

  return {
    organizationId: params.organizationId,
    ticketId: params.ticketId,
    tier: params.tier as "basic" | "standard" | "premium",
    steps,
    currentStepIndex: 0,
    status: "pending",
  };
}

/** Execute the full provisioning plan */
export async function executeProvisioningPlan(
  plan: ProvisioningPlan
): Promise<ProvisioningPlan> {
  const org = await prisma.organization.findUnique({
    where: { id: plan.organizationId },
    include: { clientProfile: true },
  });

  if (!org) {
    throw new Error(`Organization not found: ${plan.organizationId}`);
  }

  let config: AwsClientConfig;
  try {
    config = await getClientConfig(plan.organizationId);
  } catch {
    plan.status = "failed";
    plan.steps[0].status = "failed";
    plan.steps[0].error =
      "No valid AWS credentials found. Please provide AWS credentials first.";
    await savePlanToTicket(plan);
    return plan;
  }

  plan.status = "in_progress";
  plan.startedAt = new Date().toISOString();

  // Create ServiceConfig records for each service in the plan
  const services = TIER_SERVICES[plan.tier] || [];
  for (const serviceType of services) {
    const existing = await prisma.serviceConfig.findFirst({
      where: { organizationId: plan.organizationId, serviceType },
    });
    if (!existing) {
      await prisma.serviceConfig.create({
        data: {
          organizationId: plan.organizationId,
          serviceType,
          status: "pending",
          awsRegion: config.region,
        },
      });
    }
  }

  // Collect results from all steps for cross-referencing
  const allResults: Record<string, unknown> = {};
  const domain = org.clientProfile?.website
    ?.replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  for (let i = plan.currentStepIndex; i < plan.steps.length; i++) {
    const step = plan.steps[i];
    step.status = "in_progress";
    step.startedAt = new Date().toISOString();
    plan.currentStepIndex = i;
    await savePlanToTicket(plan);

    try {
      let result: { result?: Record<string, unknown>; error?: string };

      switch (step.service) {
        case "connect":
          result = await executeConnectStep(config, step, {
            organizationId: plan.organizationId,
            organizationSlug: org.slug,
            previousResults: allResults,
          });
          break;
        case "ses":
          result = await executeSesStep(config, step, {
            organizationId: plan.organizationId,
            organizationSlug: org.slug,
            domain,
            previousResults: allResults,
          });
          break;
        case "pinpoint":
          result = await executePinpointStep(config, step, {
            organizationId: plan.organizationId,
            organizationSlug: org.slug,
            previousResults: allResults,
          });
          break;
        default:
          result = { error: `Unknown service: ${step.service}` };
      }

      if (result.error) {
        step.status = "failed";
        step.error = result.error;
        plan.status = "failed";
        await savePlanToTicket(plan);
        logger.error("Provisioning step failed", {
          stepId: step.id,
          error: result.error,
        });
        return plan;
      }

      // Success
      step.status = "completed";
      step.completedAt = new Date().toISOString();
      step.result = result.result;
      Object.assign(allResults, result.result || {});
    } catch (err) {
      step.status = "failed";
      step.error = err instanceof Error ? err.message : "Unknown error";
      plan.status = "failed";
      await savePlanToTicket(plan);
      logger.error(
        "Provisioning step threw exception",
        { stepId: step.id },
        err
      );
      return plan;
    }
  }

  // All steps completed
  plan.status = "completed";
  plan.completedAt = new Date().toISOString();

  // Update ServiceConfig statuses to active
  const completedServices = [
    ...new Set(
      plan.steps.filter((s) => s.status === "completed").map((s) => s.service)
    ),
  ];
  for (const serviceType of completedServices) {
    await prisma.serviceConfig.updateMany({
      where: { organizationId: plan.organizationId, serviceType },
      data: { status: "active" },
    });
  }

  // Update ticket status
  await prisma.implementationTicket.update({
    where: { id: plan.ticketId },
    data: {
      status: "completed",
      completedAt: new Date(),
    },
  });

  await savePlanToTicket(plan);

  // Send completion email to the org owner
  try {
    const owner = await prisma.organizationMember.findFirst({
      where: { organizationId: plan.organizationId, role: "owner" },
      include: { user: { select: { email: true } } },
    });
    if (owner?.user.email) {
      await sendImplementationCompleteNotification({
        email: owner.user.email,
        orgName: org.name,
      });
    }
  } catch (emailErr) {
    // Don't fail the provisioning because of an email error
    logger.error("Failed to send provisioning completion email", {}, emailErr);
  }

  logger.info("Provisioning completed", {
    organizationId: plan.organizationId,
    tier: plan.tier,
    stepsCompleted: plan.steps.filter((s) => s.status === "completed").length,
  });

  return plan;
}

/** Retry a failed plan from the failed step */
export async function retryProvisioningPlan(
  ticketId: string
): Promise<ProvisioningPlan> {
  const ticket = await prisma.implementationTicket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket?.provisioningSteps) {
    throw new Error("No provisioning plan found for this ticket");
  }

  const plan = ticket.provisioningSteps as unknown as ProvisioningPlan;

  // Reset the failed step to pending
  const failedIndex = plan.steps.findIndex((s) => s.status === "failed");
  if (failedIndex >= 0) {
    plan.steps[failedIndex].status = "pending";
    plan.steps[failedIndex].error = undefined;
    plan.currentStepIndex = failedIndex;
    plan.status = "in_progress";
  }

  return executeProvisioningPlan(plan);
}

/** Save plan state to ImplementationTicket */
async function savePlanToTicket(plan: ProvisioningPlan) {
  await prisma.implementationTicket.update({
    where: { id: plan.ticketId },
    data: {
      provisioningSteps: JSON.parse(JSON.stringify(plan)),
      provisioningMode: "auto",
      status:
        plan.status === "completed"
          ? "completed"
          : plan.status === "failed"
            ? "in_progress" // Keep ticket in_progress so admin sees it
            : "in_progress",
    },
  });
}
