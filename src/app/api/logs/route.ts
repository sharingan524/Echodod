/**
 * Communication Logs API - List logs with filtering
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateQuery } from "@/lib/api/validation";
import { logFilterSchema } from "@/lib/api/schemas/communication-log";
import { paginationSchema, getPaginationSkip, calculatePagination } from "@/lib/api/pagination";
import { jsonOk } from "@/lib/api/response";

// GET /api/logs - List communication logs with filtering
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  const url = new URL(request.url);
  const filters = validateQuery(url, logFilterSchema);
  const pagination = validateQuery(url, paginationSchema);
  const skip = getPaginationSkip(pagination);

  // Build where clause
  const where: Prisma.CommunicationLogWhereInput = { organizationId };

  if (filters.channel) {
    where.channel = filters.channel;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.outcome) {
    where.outcome = filters.outcome;
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }
    if (filters.endDate) {
      where.createdAt.lte = filters.endDate;
    }
  }

  if (filters.search) {
    where.OR = [
      { content: { contains: filters.search, mode: "insensitive" } },
      { contactInfo: { contains: filters.search } },
      { subject: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [logs, total] = await prisma.$transaction([
    prisma.communicationLog.findMany({
      where,
      skip,
      take: pagination.pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.communicationLog.count({ where }),
  ]);

  return jsonOk(request, {
    data: logs,
    pagination: calculatePagination(total, pagination),
  });
});
