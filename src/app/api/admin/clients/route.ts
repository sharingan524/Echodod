/**
 * Admin Clients API - List all client organizations
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";

// GET /api/admin/clients - List all organizations with profiles, billing, and service counts
export const GET = withErrorHandler(async (request: NextRequest) => {
  await requireSuperAdmin();

  const url = new URL(request.url);
  const search = url.searchParams.get("search") || undefined;
  const status = url.searchParams.get("status") || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("pageSize") || "20", 10))
  );
  const skip = (page - 1) * pageSize;

  const where: Prisma.OrganizationWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { clientProfile: { businessName: { contains: search, mode: "insensitive" } } },
    ];
  }

  if (status) {
    where.billingInfo = { serviceStatus: status };
  }

  const [organizations, total] = await prisma.$transaction([
    prisma.organization.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        clientProfile: true,
        billingInfo: true,
        _count: {
          select: { serviceConfigs: true },
        },
      },
    }),
    prisma.organization.count({ where }),
  ]);

  return jsonOk(request, {
    data: organizations,
    meta: {
      total,
      page,
      pageSize,
    },
  });
});
