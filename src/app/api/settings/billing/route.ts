/**
 * Billing Settings - Get billing info
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { NotFoundError } from "@/lib/api/errors";
import { jsonOk } from "@/lib/api/response";

// GET /api/settings/billing - Get billing info
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
  });

  const billing = await prisma.billingInfo.findUnique({
    where: { organizationId },
  });

  if (!billing) {
    throw new NotFoundError("Billing information");
  }

  return jsonOk(request, billing);
});
