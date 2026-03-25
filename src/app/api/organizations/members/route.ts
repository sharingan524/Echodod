/**
 * Organization Members API — list and invite
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk, jsonCreated } from "@/lib/api/response";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { audit } from "@/lib/audit";

// GET /api/organizations/members
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  const members = await prisma.organizationMember.findMany({
    where: { organizationId },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const data = members.map((m) => ({
    id: m.id,
    role: m.role,
    createdAt: m.createdAt.toISOString(),
    user: m.user,
  }));

  return jsonOk(request, { data });
});

// POST /api/organizations/members — invite by email
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { organizationId, userId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const body = await request.json();
  const { email, role } = body as { email?: string; role?: string };

  if (!email || typeof email !== "string") {
    throw new BadRequestError("Email is required");
  }

  const memberRole = role === "admin" ? "admin" : "member";

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new NotFoundError("No user found with that email. They must sign up first.");
  }

  // Check if already a member
  const existing = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId: user.id, organizationId } },
  });
  if (existing) {
    throw new BadRequestError("User is already a member of this organization");
  }

  const membership = await prisma.organizationMember.create({
    data: {
      userId: user.id,
      organizationId,
      role: memberRole,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  audit({
    organizationId,
    userId,
    action: "member.invited",
    targetType: "user",
    targetId: user.id,
    metadata: { email, role: memberRole },
  });

  return jsonCreated(request, {
    id: membership.id,
    role: membership.role,
    createdAt: membership.createdAt.toISOString(),
    user: membership.user,
  });
});
