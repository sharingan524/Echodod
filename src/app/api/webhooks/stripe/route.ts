/**
 * Stripe Webhook Handler
 * Processes implementation payments and maintenance subscription lifecycle events from Stripe
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { validateWebhookSignature, IMPLEMENTATION_TIERS, MAINTENANCE_PLANS } from "@/lib/stripe";
import {
  sendPaymentFailedAlert,
  sendPaymentSuccessAlert,
  sendImplementationPaidConfirmation,
} from "@/lib/email";
import { logger } from "@/lib/logger";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const rateLimited = applyRateLimit(request, "stripe-webhook", RATE_LIMITS.webhook);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      logger.error("STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    // Validate webhook signature
    const event = validateWebhookSignature(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    logger.info("Stripe webhook received", { eventType: event.type });

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        logger.debug("Unhandled Stripe event type", { eventType: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Error processing Stripe webhook", {}, error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

/**
 * Handle checkout session completed
 * Routes to implementation or maintenance handler based on session metadata
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const organizationId = session.metadata?.organizationId;
  const type = session.metadata?.type;

  if (!organizationId || !type) {
    logger.error("Missing metadata in checkout session");
    return;
  }

  if (type === "implementation") {
    await handleImplementationCheckout(session, organizationId);
  } else if (type === "maintenance") {
    await handleMaintenanceCheckout(session, organizationId);
  } else {
    logger.error("Unknown checkout type", { type, organizationId });
  }
}

/**
 * Handle implementation payment completed
 * Records the implementation fee and creates an ImplementationTicket
 */
async function handleImplementationCheckout(
  session: Stripe.Checkout.Session,
  organizationId: string
) {
  const tier = session.metadata?.tier as keyof typeof IMPLEMENTATION_TIERS | undefined;

  if (!tier || !(tier in IMPLEMENTATION_TIERS)) {
    logger.error("Invalid implementation tier in session metadata", { tier, organizationId });
    return;
  }

  const tierConfig = IMPLEMENTATION_TIERS[tier];
  const implementationFee = tierConfig.price * 100; // Store in cents

  logger.info("Implementation payment completed", { organizationId, tier });

  // Update billing info with implementation details
  const billingInfo = await prisma.billingInfo.findUnique({
    where: { organizationId },
  });

  if (billingInfo) {
    await prisma.billingInfo.update({
      where: { id: billingInfo.id },
      data: {
        implementationPaidAt: new Date(),
        implementationFee,
      },
    });
  } else {
    await prisma.billingInfo.create({
      data: {
        organizationId,
        stripeCustomerId: session.customer as string,
        implementationPaidAt: new Date(),
        implementationFee,
        monthlyMaintenanceFee: 0,
        serviceStatus: "pending",
        billingCycle: new Date(),
      },
    });
  }

  // Create an ImplementationTicket with status "pending"
  const ticket = await prisma.implementationTicket.create({
    data: {
      organizationId,
      title: `${tierConfig.name} Implementation - AWS Connect Setup`,
      description: `${tierConfig.name} tier implementation purchased. Features: ${tierConfig.features.join(", ")}`,
      status: "pending",
      priority: tier === "premium" ? "high" : tier === "standard" ? "medium" : "normal",
    },
  });

  // Attempt automated provisioning if client has AWS credentials
  try {
    const awsCredential = await prisma.awsCredential.findUnique({
      where: { organizationId },
      select: { isValid: true },
    });

    if (awsCredential?.isValid) {
      const { buildProvisioningPlan, executeProvisioningPlan } = await import(
        "@/lib/provisioning/orchestrator"
      );
      const plan = buildProvisioningPlan({
        organizationId,
        ticketId: ticket.id,
        tier,
      });

      // Fire and forget — provisioning runs in the background
      executeProvisioningPlan(plan).catch((err) => {
        logger.error("Auto-provisioning failed after payment", { organizationId }, err);
      });

      logger.info("Auto-provisioning triggered after payment", { organizationId, tier });
    } else {
      logger.info("No AWS credentials found, provisioning will be manual", { organizationId });
    }
  } catch (provisioningErr) {
    // Never let provisioning errors block payment processing
    logger.error("Error checking provisioning eligibility", { organizationId }, provisioningErr);
  }

  // Send confirmation email to owner
  const owner = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      role: "owner",
    },
    include: { user: true },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (owner?.user.email && organization) {
    await sendImplementationPaidConfirmation({
      email: owner.user.email,
      orgName: organization.name,
      tier: tierConfig.name,
    });
  }
}

/**
 * Handle maintenance subscription checkout completed
 * Stores the subscription ID and activates the service
 */
async function handleMaintenanceCheckout(session: Stripe.Checkout.Session, organizationId: string) {
  const subscriptionId = session.subscription as string;
  const plan = session.metadata?.plan as keyof typeof MAINTENANCE_PLANS | undefined;

  if (!subscriptionId) {
    logger.error("Missing subscription ID in maintenance checkout", { organizationId });
    return;
  }

  logger.info("Maintenance subscription started", { organizationId, plan });

  const monthlyMaintenanceFee =
    plan && plan in MAINTENANCE_PLANS ? MAINTENANCE_PLANS[plan].price * 100 : 0;

  // Update organization with subscription ID
  await prisma.organization.update({
    where: { id: organizationId },
    data: { subscriptionId },
  });

  // Update billing info
  const billingInfo = await prisma.billingInfo.findUnique({
    where: { organizationId },
  });

  if (billingInfo) {
    await prisma.billingInfo.update({
      where: { id: billingInfo.id },
      data: {
        serviceStatus: "active",
        monthlyMaintenanceFee,
        billingCycle: new Date(),
      },
    });
  } else {
    await prisma.billingInfo.create({
      data: {
        organizationId,
        stripeCustomerId: session.customer as string,
        serviceStatus: "active",
        monthlyMaintenanceFee,
        implementationFee: 0,
        billingCycle: new Date(),
      },
    });
  }
}

/**
 * Handle subscription deleted
 * Suspends maintenance service
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const organizationId = subscription.metadata?.organizationId;

  if (!organizationId) {
    logger.error("Missing organizationId in subscription metadata");
    return;
  }

  logger.info("Maintenance subscription deleted", { organizationId });

  // Clear subscription ID
  await prisma.organization.update({
    where: { id: organizationId },
    data: {
      subscriptionId: null,
    },
  });

  // Set service status to suspended
  const billingInfo = await prisma.billingInfo.findUnique({
    where: { organizationId },
  });

  if (billingInfo) {
    await prisma.billingInfo.update({
      where: { id: billingInfo.id },
      data: {
        serviceStatus: "suspended",
      },
    });
  }
}

/**
 * Handle invoice paid
 * Clears payment failure flag and reactivates service if it was suspended
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  // Find organization by Stripe customer ID
  const billingInfo = await prisma.billingInfo.findUnique({
    where: { stripeCustomerId: customerId },
    include: { organization: true },
  });

  if (!billingInfo) {
    logger.error("No billing info found for customer", { customerId });
    return;
  }

  logger.info("Invoice paid", { organizationId: billingInfo.organizationId });

  const wasSuspended =
    billingInfo.serviceStatus === "suspended" || billingInfo.paymentFailedAt !== null;

  // Clear payment failure and update billing cycle
  await prisma.billingInfo.update({
    where: { id: billingInfo.id },
    data: {
      billingCycle: new Date(),
      paymentFailedAt: null,
      serviceStatus: "active",
    },
  });

  if (wasSuspended) {
    logger.info("Maintenance service reactivated after payment", {
      organizationId: billingInfo.organizationId,
    });

    // Send reactivation email to owner
    const owner = await prisma.organizationMember.findFirst({
      where: {
        organizationId: billingInfo.organizationId,
        role: "owner",
      },
      include: { user: true },
    });

    if (owner?.user.email) {
      await sendPaymentSuccessAlert({
        to: owner.user.email,
        organizationName: billingInfo.organization.name,
      });
    }
  }
}

/**
 * Handle invoice payment failed
 * Records payment failure timestamp and sends alert email
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  const billingInfo = await prisma.billingInfo.findUnique({
    where: { stripeCustomerId: customerId },
    include: { organization: true },
  });

  if (!billingInfo) {
    logger.error("No billing info found for customer", { customerId });
    return;
  }

  logger.warn("Payment failed", { organizationId: billingInfo.organizationId });

  // Record payment failure time
  await prisma.billingInfo.update({
    where: { id: billingInfo.id },
    data: {
      paymentFailedAt: billingInfo.paymentFailedAt ?? new Date(),
    },
  });

  logger.info("Payment failure recorded", {
    organizationId: billingInfo.organizationId,
    paymentFailedAt: billingInfo.paymentFailedAt?.toISOString() ?? new Date().toISOString(),
  });

  // Send payment failure email to owner
  const owner = await prisma.organizationMember.findFirst({
    where: {
      organizationId: billingInfo.organizationId,
      role: "owner",
    },
    include: { user: true },
  });

  if (owner?.user.email) {
    await sendPaymentFailedAlert({
      to: owner.user.email,
      organizationName: billingInfo.organization.name,
    });
  }
}
