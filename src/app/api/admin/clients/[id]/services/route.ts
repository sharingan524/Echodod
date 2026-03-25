/**
 * Admin Client Services API - Manage service configs for an organization
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { NotFoundError, BadRequestError } from "@/lib/api/errors";
import { jsonOk, jsonCreated } from "@/lib/api/response";

// GET /api/admin/clients/:id/services - List all service configs for an organization
export const GET = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await requireSuperAdmin();
    const { id } = await params;

    // Verify the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!organization) {
      throw new NotFoundError("Organization");
    }

    const services = await prisma.serviceConfig.findMany({
      where: { organizationId: id },
      orderBy: { createdAt: "desc" },
    });

    return jsonOk(request, services);
  }
);

// POST /api/admin/clients/:id/services - Create a new service config
export const POST = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await requireSuperAdmin();
    const { id } = await params;

    // Verify the organization exists
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!organization) {
      throw new NotFoundError("Organization");
    }

    const body = await request.json();
    const { serviceType, status, awsAccountId, awsRegion, configDetails } = body as {
      serviceType?: string;
      status?: string;
      awsAccountId?: string;
      awsRegion?: string;
      configDetails?: Record<string, unknown>;
    };

    if (!serviceType) {
      throw new BadRequestError("serviceType is required");
    }

    const service = await prisma.serviceConfig.create({
      data: {
        organizationId: id,
        serviceType,
        status: status || "pending",
        awsAccountId: awsAccountId || null,
        awsRegion: awsRegion || null,
        configDetails: configDetails
          ? (configDetails as Prisma.InputJsonValue)
          : Prisma.JsonNull,
      },
    });

    return jsonCreated(request, service);
  }
);
