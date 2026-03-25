/**
 * Admin Tickets API - List and create implementation tickets
 */

import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { BadRequestError } from "@/lib/api/errors";
import { jsonOk, jsonCreated } from "@/lib/api/response";

// GET /api/admin/tickets - List all implementation tickets
export const GET = withErrorHandler(async (request: NextRequest) => {
  await requireSuperAdmin();

  const url = new URL(request.url);
  const status = url.searchParams.get("status") || undefined;
  const priority = url.searchParams.get("priority") || undefined;
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(url.searchParams.get("pageSize") || "20", 10))
  );
  const skip = (page - 1) * pageSize;

  const where: Prisma.ImplementationTicketWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  const [tickets, total] = await prisma.$transaction([
    prisma.implementationTicket.findMany({
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
    prisma.implementationTicket.count({ where }),
  ]);

  return jsonOk(request, {
    data: tickets,
    meta: {
      total,
      page,
      pageSize,
    },
  });
});

// POST /api/admin/tickets - Create a new implementation ticket
export const POST = withErrorHandler(async (request: NextRequest) => {
  await requireSuperAdmin();

  const body = await request.json();
  const { organizationId, title, description, priority, assignedTo } = body as {
    organizationId?: string;
    title?: string;
    description?: string;
    priority?: string;
    assignedTo?: string;
  };

  if (!organizationId || !title) {
    throw new BadRequestError("organizationId and title are required");
  }

  const ticket = await prisma.implementationTicket.create({
    data: {
      organizationId,
      title,
      description: description || null,
      priority: priority || "normal",
      assignedTo: assignedTo || null,
    },
    include: {
      organization: {
        include: {
          clientProfile: true,
        },
      },
    },
  });

  return jsonCreated(request, ticket);
});
