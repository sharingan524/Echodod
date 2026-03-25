/**
 * Organization Member [id] — update role, remove member
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/lib/api/errors";
import { audit } from "@/lib/audit";

type RouteContext = { params: Promise<{ id: string }> };

// PATCH /api/organizations/members/[id] — update role
export const PATCH = withErrorHandler(async (request: NextRequest, context: RouteContext) => {
  const {
    organizationId,
    role: callerRole,
    userId,
  } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const { id } = await context.params;

  const member = await prisma.organizationMember.findFirst({
    where: { id, organizationId },
  });

  if (!member) {
    throw new NotFoundError("Member not found");
  }

  // Cannot change owner's role unless you're the owner
  if (member.role === "owner" && callerRole !== "owner") {
    throw new ForbiddenError("Only the owner can change the owner's role");
  }

  const body = await request.json();
  const { role } = body as { role?: string };

  if (!role || !["admin", "member"].includes(role)) {
    throw new BadRequestError("Role must be 'admin' or 'member'");
  }

  // Cannot set someone to owner via this endpoint
  if (role === "owner") {
    throw new BadRequestError("Cannot assign owner role through this endpoint");
  }

  const updated = await prisma.organizationMember.update({
    where: { id },
    data: { role },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  });

  audit({
    organizationId,
    userId,
    action: "member.role_changed",
    targetType: "user",
    targetId: member.userId,
    metadata: { oldRole: member.role, newRole: role },
  });

  return jsonOk(request, {
    id: updated.id,
    role: updated.role,
    createdAt: updated.createdAt.toISOString(),
    user: updated.user,
  });
});

// DELETE /api/organizations/members/[id] — remove member
export const DELETE = withErrorHandler(async (request: NextRequest, context: RouteContext) => {
  const {
    organizationId,
    role: callerRole,
    userId,
  } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const { id } = await context.params;

  const member = await prisma.organizationMember.findFirst({
    where: { id, organizationId },
  });

  if (!member) {
    throw new NotFoundError("Member not found");
  }

  // Cannot remove the owner
  if (member.role === "owner") {
    throw new ForbiddenError("Cannot remove the organization owner");
  }

  // Admins can only remove members, not other admins
  if (member.role === "admin" && callerRole !== "owner") {
    throw new ForbiddenError("Only the owner can remove admins");
  }

  await prisma.organizationMember.delete({ where: { id } });

  audit({
    organizationId,
    userId,
    action: "member.removed",
    targetType: "user",
    targetId: member.userId,
  });

  return jsonOk(request, { deleted: true });
});
