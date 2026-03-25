/**
 * Provisioning API — Trigger and manage automated provisioning
 *
 * POST /api/admin/clients/:id/provision — Trigger provisioning (async)
 * GET  /api/admin/clients/:id/provision — Get provisioning status
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateBody } from "@/lib/api/validation";
import { triggerProvisioningSchema } from "@/lib/api/schemas/provisioning";
import { NotFoundError, BadRequestError } from "@/lib/api/errors";
import { jsonOk, jsonCreated } from "@/lib/api/response";
import {
  buildProvisioningPlan,
  executeProvisioningPlan,
} from "@/lib/provisioning/orchestrator";
import { audit } from "@/lib/audit";
import { logger } from "@/lib/logger";

export const POST = withErrorHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { userId } = await requireSuperAdmin();
    const { id: organizationId } = await params;

    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        implementationTickets: {
          where: { status: { not: "cancelled" } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!org) throw new NotFoundError("Organization");

    const body = await validateBody(request, triggerProvisioningSchema);

    // Determine tier from org plan or explicit override
    const tier = body.tier || org.plan;
    if (!["basic", "standard", "premium"].includes(tier)) {
      throw new BadRequestError(
        "Organization must have a valid tier (basic, standard, premium)"
      );
    }

    // Find or create the ticket
    let ticketId = body.ticketId;
    if (!ticketId) {
      const latestTicket = org.implementationTickets[0];
      if (latestTicket) {
        ticketId = latestTicket.id;
      } else {
        const ticket = await prisma.implementationTicket.create({
          data: {
            organizationId,
            title: `Auto-provisioning: ${tier} tier`,
            description: "Automated provisioning triggered by admin",
            status: "in_progress",
            priority: "high",
          },
        });
        ticketId = ticket.id;
      }
    }

    const plan = buildProvisioningPlan({ organizationId, ticketId: ticketId!, tier });

    audit({
      organizationId,
      userId,
      action: "provisioning.triggered",
      targetType: "implementation_ticket",
      targetId: ticketId,
      metadata: { tier },
    });

    // Execute asynchronously — return immediately with the plan
    executeProvisioningPlan(plan).catch((err) => {
      logger.error("Provisioning failed", { organizationId }, err);
    });

    return jsonCreated(request, {
      message: "Provisioning started",
      ticketId,
      plan: {
        tier,
        steps: plan.steps.map((s) => ({
          id: s.id,
          name: s.name,
          status: s.status,
        })),
      },
    });
  }
);

export const GET = withErrorHandler(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    await requireSuperAdmin();
    const { id: organizationId } = await params;

    const tickets = await prisma.implementationTicket.findMany({
      where: {
        organizationId,
        provisioningMode: "auto",
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const plans = tickets.map((t: { id: string; status: string; provisioningSteps: unknown; createdAt: Date; completedAt: Date | null }) => ({
      ticketId: t.id,
      status: t.status,
      provisioningSteps: t.provisioningSteps,
      createdAt: t.createdAt,
      completedAt: t.completedAt,
    }));

    return jsonOk(request, plans);
  }
);
