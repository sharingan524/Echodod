/**
 * Stripe Customer Portal API
 * Creates a portal session for managing subscriptions
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { createBillingPortalSession } from "@/lib/stripe";
import { jsonError, jsonOk } from "@/lib/api/response";

// POST /api/billing/portal - Create portal session
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
  });

  // Get billing info
  const billingInfo = await prisma.billingInfo.findUnique({
    where: { organizationId },
  });

  if (!billingInfo || !billingInfo.stripeCustomerId) {
    return jsonError(
      request,
      {
        message: "No billing account found",
        code: "NOT_FOUND",
      },
      404
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  // Create portal session
  const session = await createBillingPortalSession({
    customerId: billingInfo.stripeCustomerId,
    returnUrl: `${baseUrl}/settings`,
  });

  return jsonOk(request, {
    url: session.url,
  });
});
