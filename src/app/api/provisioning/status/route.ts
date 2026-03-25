/**
 * Client-Facing Provisioning Status API
 * Returns the setup progress for the authenticated organization.
 *
 * GET /api/provisioning/status
 */

import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";
import { prisma } from "@/lib/db";

interface SetupStep {
  id: string;
  label: string;
  status: "completed" | "in_progress" | "pending" | "failed";
  detail?: string;
}

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
  });

  // Get organization info
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { name: true, plan: true, createdAt: true },
  });

  // Get the latest implementation ticket for this org
  const ticket = await prisma.implementationTicket.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  // Get active service configs
  const services = await prisma.serviceConfig.findMany({
    where: { organizationId },
    select: { serviceType: true, status: true, createdAt: true },
  });

  // Get AWS credentials status
  const credentials = await prisma.awsCredential.findFirst({
    where: { organizationId },
    select: { isValid: true, lastValidatedAt: true },
  });

  // Build setup steps
  const steps: SetupStep[] = [];

  // Step 1: Account created
  steps.push({
    id: "account",
    label: "Account created",
    status: "completed",
    detail: org ? `Organization: ${org.name}` : undefined,
  });

  // Step 2: Payment / plan selection
  steps.push({
    id: "payment",
    label: "Plan selected",
    status: ticket ? "completed" : "pending",
    detail: ticket ? `Ticket: ${ticket.title}` : "Choose an implementation tier",
  });

  // Step 3: AWS credentials
  steps.push({
    id: "credentials",
    label: "AWS credentials configured",
    status: credentials?.isValid ? "completed" : credentials ? "failed" : "pending",
    detail: credentials?.isValid
      ? `Verified ${credentials.lastValidatedAt ? new Date(credentials.lastValidatedAt).toLocaleDateString() : ""}`
      : credentials
        ? "Credentials invalid — please update"
        : "Provide your AWS credentials",
  });

  // Step 4: Service provisioning
  const provisioningStatus = ticket?.status;
  let provStep: SetupStep["status"] = "pending";
  let provDetail = "Waiting for previous steps";

  if (provisioningStatus === "completed") {
    provStep = "completed";
    provDetail = `${services.length} service(s) provisioned`;
  } else if (provisioningStatus === "in_progress") {
    provStep = "in_progress";
    provDetail = "Services are being provisioned...";
  } else if (provisioningStatus === "failed") {
    provStep = "failed";
    provDetail = "Provisioning encountered an error";
  } else if (ticket) {
    provStep = "pending";
    provDetail = "Provisioning queued";
  }

  steps.push({
    id: "provisioning",
    label: "Services provisioned",
    status: provStep,
    detail: provDetail,
  });

  // Step 5: Services active
  const activeCount = services.filter((s: { status: string }) => s.status === "active").length;
  steps.push({
    id: "active",
    label: "Services active",
    status: activeCount > 0 ? "completed" : "pending",
    detail:
      activeCount > 0
        ? `${activeCount} active service(s)`
        : "Services will be activated after provisioning",
  });

  const completedCount = steps.filter((s) => s.status === "completed").length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return jsonOk(request, {
    progress,
    steps,
    plan: org?.plan || null,
    ticketStatus: ticket?.status || null,
  });
});
