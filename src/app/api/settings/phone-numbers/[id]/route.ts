/**
 * Phone Numbers Settings - Update and delete individual phone number
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateBody } from "@/lib/api/validation";
import { updatePhoneNumberSchema } from "@/lib/api/schemas/phone-number";
import { NotFoundError } from "@/lib/api/errors";
import { jsonOk } from "@/lib/api/response";

// PATCH /api/settings/phone-numbers/:id - Update phone number (assign agent, toggle active)
export const PATCH = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { organizationId } = await requireAuth(request, {
      requireOrg: true,
      minRole: "admin",
    });
    const { id } = await params;

    const data = await validateBody(request, updatePhoneNumberSchema);

    const result = await prisma.phoneNumber.updateMany({
      where: {
        id,
        organizationId,
      },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundError("Phone Number");
    }

    const updated = await prisma.phoneNumber.findUnique({
      where: { id },
    });

    return jsonOk(request, updated);
  }
);

// DELETE /api/settings/phone-numbers/:id - Remove phone number
export const DELETE = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { organizationId } = await requireAuth(request, {
      requireOrg: true,
      minRole: "admin",
    });
    const { id } = await params;

    const deleted = await prisma.phoneNumber.deleteMany({
      where: {
        id,
        organizationId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundError("Phone Number");
    }

    return jsonOk(request, null);
  }
);
