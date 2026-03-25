/**
 * Organizations API - List user's organizations
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";

// GET /api/organizations
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { userId } = await requireAuth(request);

  const memberships = await prisma.organizationMember.findMany({
    where: { userId },
    include: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const organizations = memberships.map((m: { organization: Record<string, unknown>; role: string }) => ({
    ...m.organization,
    role: m.role,
  }));

  return jsonOk(request, organizations);
});
