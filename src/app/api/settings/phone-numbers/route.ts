/**
 * Phone Numbers Settings - List and create phone numbers
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateBody } from "@/lib/api/validation";
import { createPhoneNumberSchema } from "@/lib/api/schemas/phone-number";
import { jsonCreated, jsonOk } from "@/lib/api/response";

// GET /api/settings/phone-numbers - List phone numbers
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const phoneNumbers = await prisma.phoneNumber.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk(request, { data: phoneNumbers });
});

// POST /api/settings/phone-numbers - Add phone number
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const data = await validateBody(request, createPhoneNumberSchema);

  const phoneNumber = await prisma.phoneNumber.create({
    data: {
      ...data,
      isActive: true,
      organizationId,
    },
  });

  return jsonCreated(request, phoneNumber);
});
