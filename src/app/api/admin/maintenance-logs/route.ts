/**
 * Admin Maintenance Logs API - List and create maintenance logs
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { BadRequestError } from "@/lib/api/errors";
import { jsonOk, jsonCreated } from "@/lib/api/response";

// GET /api/admin/maintenance-logs - List all maintenance logs
export const GET = withErrorHandler(async (request: NextRequest) => {
  await requireSuperAdmin();

  const url = new URL(request.url);
  const organizationId = url.searchParams.get("organizationId") || undefined;
  const type = url.searchParams.get("type") || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("pageSize") || "20", 10))
  );
  const skip = (page - 1) * pageSize;

  const where: Prisma.MaintenanceLogWhereInput = {};

  if (organizationId) {
    where.organizationId = organizationId;
  }

  if (type) {
    where.type = type;
  }

  const [logs, total] = await prisma.$transaction([
    prisma.maintenanceLog.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        organization: {
          include: {
            clientProfile: true,
          },
        },
      },
    }),
    prisma.maintenanceLog.count({ where }),
  ]);

  return jsonOk(request, {
    data: logs,
    meta: {
      total,
      page,
      pageSize,
    },
  });
});

// POST /api/admin/maintenance-logs - Create a new maintenance log
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireSuperAdmin();

  const body = await request.json();
  const { organizationId, description, type, performedBy } = body as {
    organizationId?: string;
    description?: string;
    type?: string;
    performedBy?: string;
  };

  if (!organizationId || !description || !type) {
    throw new BadRequestError("organizationId, description, and type are required");
  }

  const log = await prisma.maintenanceLog.create({
    data: {
      organizationId,
      description,
      type,
      performedBy: performedBy || userId,
    },
    include: {
      organization: {
        include: {
          clientProfile: true,
        },
      },
    },
  });

  return jsonCreated(request, log);
});
