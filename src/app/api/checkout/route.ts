/**
 * Checkout Session API
 * Creates Stripe checkout sessions for implementation payments and maintenance subscriptions
 */

import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateBody } from "@/lib/api/validation";
import {
  createImplementationCheckout,
  createMaintenanceCheckout,
  createStripeCustomer,
} from "@/lib/stripe";
import { jsonError, jsonOk } from "@/lib/api/response";

const checkoutSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("implementation"),
    tier: z.enum(["basic", "standard", "premium"]),
  }),
  z.object({
    type: z.literal("maintenance"),
    plan: z.enum(["essential", "professional", "enterprise"]),
  }),
]);

// POST /api/checkout - Create a checkout session
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { user, organizationId } = await requireAuth(request, {
    requireOrg: true,
  });

  const data = await validateBody(request, checkoutSchema);

  // Get organization with billing info
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    include: { billingInfo: true },
  });

  if (!organization) {
    return jsonError(
      request,
      {
        message: "Organization not found",
        code: "NOT_FOUND",
      },
      404
    );
  }

  // Get or create Stripe customer
  let stripeCustomerId = organization.billingInfo?.stripeCustomerId;

  if (!stripeCustomerId) {
    // Create new Stripe customer
    const customer = await createStripeCustomer({
      email: user.email!,
      name: organization.name,
      organizationId: organization.id,
    });

    stripeCustomerId = customer.id;

    // Update billing info
    if (organization.billingInfo) {
      await prisma.billingInfo.update({
        where: { id: organization.billingInfo.id },
        data: { stripeCustomerId },
      });
    } else {
      await prisma.billingInfo.create({
        data: {
          organizationId: organization.id,
          stripeCustomerId,
          implementationFee: 0,
          monthlyMaintenanceFee: 0,
          serviceStatus: "pending",
          billingCycle: new Date(),
        },
      });
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  if (data.type === "implementation") {
    const session = await createImplementationCheckout({
      customerId: stripeCustomerId,
      tier: data.tier,
      organizationId: organization.id,
      successUrl: `${baseUrl}/dashboard?checkout=success&type=implementation`,
      cancelUrl: `${baseUrl}/settings?checkout=cancelled`,
    });

    return jsonOk(request, {
      sessionId: session.id,
      url: session.url,
    });
  }

  // maintenance
  const session = await createMaintenanceCheckout({
    customerId: stripeCustomerId,
    plan: data.plan,
    organizationId: organization.id,
    successUrl: `${baseUrl}/dashboard?checkout=success&type=maintenance`,
    cancelUrl: `${baseUrl}/settings?checkout=cancelled`,
  });

  return jsonOk(request, {
    sessionId: session.id,
    url: session.url,
  });
});
