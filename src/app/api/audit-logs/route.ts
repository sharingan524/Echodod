/**
 * Audit Logs API — read-only access to org activity
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";

// GET /api/audit-logs?page=1&pageSize=50
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") || "1"));
  const pageSize = Math.min(
    100,
    Math.max(1, Number(request.nextUrl.searchParams.get("pageSize") || "50"))
  );

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count({ where: { organizationId } }),
  ]);

  return jsonOk(request, {
    data: logs,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});
