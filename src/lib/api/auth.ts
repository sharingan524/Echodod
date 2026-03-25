/**
 * Authentication and authorization helpers for API routes
 * CRITICAL FILE - All API routes depend on this for security
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UnauthorizedError, ForbiddenError } from "./errors";

export interface AuthContext {
  userId: string;
  organizationId: string;
  role: string; // 'owner' | 'admin' | 'member'
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

export interface SuperAdminContext {
  userId: string;
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

interface RequireAuthOptions {
  requireOrg?: boolean;
  minRole?: "owner" | "admin" | "member";
}

/**
 * Validates authentication and returns user context
 * Enforces multi-tenancy and role-based access control
 *
 * @param request - The incoming request
 * @param options - Authentication options
 * @returns AuthContext with userId, organizationId, and role
 * @throws UnauthorizedError if not authenticated
 * @throws ForbiddenError if insufficient permissions
 */
export async function requireAuth(
  request: Request,
  options: RequireAuthOptions = {}
): Promise<AuthContext> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new UnauthorizedError("You must be logged in to access this resource");
  }

  const userId = session.user.id;
  const user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image,
  };

  // If org is not required, return early
  if (!options.requireOrg) {
    return { userId, organizationId: "", role: "", user };
  }

  // Check for explicit org selection via header
  const requestedOrgId = request.headers.get("x-organization-id");

  let membership;
  if (requestedOrgId) {
    // Validate user belongs to the requested org
    membership = await prisma.organizationMember.findUnique({
      where: {
        userId_organizationId: { userId, organizationId: requestedOrgId },
      },
      include: { organization: true },
    });
  } else {
    // Fallback: use first org (backward compatible)
    membership = await prisma.organizationMember.findFirst({
      where: { userId },
      include: { organization: true },
    });
  }

  if (!membership) {
    throw new ForbiddenError("No organization found. Please create or join an organization.");
  }

  // Role-based access control
  if (options.minRole) {
    const roleHierarchy: Record<string, number> = {
      owner: 3,
      admin: 2,
      member: 1,
    };

    const userRoleLevel = roleHierarchy[membership.role] || 0;
    const requiredLevel = roleHierarchy[options.minRole] || 0;

    if (userRoleLevel < requiredLevel) {
      throw new ForbiddenError(`This action requires ${options.minRole} role or higher`);
    }
  }

  return {
    userId,
    organizationId: membership.organizationId,
    role: membership.role,
    user,
  };
}

/**
 * Validates that the current user is a super admin
 * Used for platform-level admin routes (client management, tickets, etc.)
 *
 * @returns SuperAdminContext with userId and user info
 * @throws UnauthorizedError if not authenticated
 * @throws ForbiddenError if not a super admin
 */
export async function requireSuperAdmin(): Promise<SuperAdminContext> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new UnauthorizedError("You must be logged in to access this resource");
  }

  const id = session.user.id;

  const dbUser = await prisma.user.findUnique({
    where: { id },
    select: { isSuperAdmin: true },
  });

  if (!dbUser?.isSuperAdmin) {
    throw new ForbiddenError("Super admin access required");
  }

  return {
    userId: id,
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
    },
  };
}
