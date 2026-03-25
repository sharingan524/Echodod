/**
 * Admin Ticket Detail API - Get and update a single implementation ticket
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { NotFoundError, BadRequestError } from "@/lib/api/errors";
import { jsonOk } from "@/lib/api/response";

// GET /api/admin/tickets/:id - Get ticket with organization details
export const GET = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await requireSuperAdmin();
    const { id } = await params;

    const ticket = await prisma.implementationTicket.findUnique({
      where: { id },
      include: {
        organization: {
          include: {
            clientProfile: true,
            billingInfo: true,
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundError("Implementation ticket");
    }

    return jsonOk(request, ticket);
  }
);

// PATCH /api/admin/tickets/:id - Update ticket fields
export const PATCH = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    await requireSuperAdmin();
    const { id } = await params;

    const body = await request.json();
    const { status, priority, assignedTo, description } = body as {
      status?: string;
      priority?: string;
      assignedTo?: string;
      description?: string;
    };

    if (!status && !priority && assignedTo === undefined && description === undefined) {
      throw new BadRequestError(
        "At least one of status, priority, assignedTo, or description must be provided"
      );
    }

    // Verify the ticket exists
    const existing = await prisma.implementationTicket.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundError("Implementation ticket");
    }

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;
    if (priority !== undefined) data.priority = priority;
    if (assignedTo !== undefined) data.assignedTo = assignedTo || null;
    if (description !== undefined) data.description = description || null;

    // Set completedAt when status changes to completed
    if (status === "completed") {
      data.completedAt = new Date();
    }

    const ticket = await prisma.implementationTicket.update({
      where: { id },
      data,
      include: {
        organization: {
          include: {
            clientProfile: true,
          },
        },
      },
    });

    return jsonOk(request, ticket);
  }
);
