/**
 * Admin Client Detail API - Get and update a single client organization
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { NotFoundError, BadRequestError } from "@/lib/api/errors";
import { jsonOk } from "@/lib/api/response";

// GET /api/admin/clients/:id - Full organization detail
export const GET = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await requireSuperAdmin();
    const { id } = await params;

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        clientProfile: true,
        billingInfo: true,
        serviceConfigs: true,
        communicationLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!organization) {
      throw new NotFoundError("Organization");
    }

    return jsonOk(request, organization);
  }
);

// PATCH /api/admin/clients/:id - Update organization plan or billing status
export const PATCH = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await requireSuperAdmin();
    const { id } = await params;

    const body = await request.json();
    const { serviceStatus, plan } = body as {
      serviceStatus?: string;
      plan?: string;
    };

    if (!serviceStatus && !plan) {
      throw new BadRequestError("At least one of serviceStatus or plan must be provided");
    }

    // Verify the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: { billingInfo: true },
    });

    if (!organization) {
      throw new NotFoundError("Organization");
    }

    // Update plan on the organization if provided
    if (plan) {
      await prisma.organization.update({
        where: { id },
        data: { plan },
      });
    }

    // Update service status on billing info if provided
    if (serviceStatus && organization.billingInfo) {
      await prisma.billingInfo.update({
        where: { organizationId: id },
        data: { serviceStatus },
      });
    }

    // Return the updated organization
    const updated = await prisma.organization.findUnique({
      where: { id },
      include: {
        clientProfile: true,
        billingInfo: true,
        serviceConfigs: true,
      },
    });

    return jsonOk(request, updated);
  }
);
