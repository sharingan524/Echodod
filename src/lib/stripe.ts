/**
 * Stripe Client and Configuration
 * Handles implementation payments, maintenance subscriptions, and billing
 *
 * Environment Variables Required:
 * - STRIPE_SECRET_KEY: Your Stripe secret key (sk_test_* for testing, sk_live_* for production)
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret (whsec_test_* for testing, whsec_* for production)
 * - STRIPE_BASIC_IMPL_PRICE_ID: Price ID for Basic implementation tier
 * - STRIPE_STANDARD_IMPL_PRICE_ID: Price ID for Standard implementation tier
 * - STRIPE_PREMIUM_IMPL_PRICE_ID: Price ID for Premium implementation tier
 * - STRIPE_ESSENTIAL_MAINT_PRICE_ID: Price ID for Essential maintenance plan
 * - STRIPE_PROFESSIONAL_MAINT_PRICE_ID: Price ID for Professional maintenance plan
 * - STRIPE_ENTERPRISE_MAINT_PRICE_ID: Price ID for Enterprise maintenance plan
 *
 * @see README.md for setup instructions
 */

import Stripe from "stripe";

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY must be defined in environment variables");
  }
  const isTestMode = key.startsWith("sk_test_");
  const isLiveMode = key.startsWith("sk_live_");
  if (!isTestMode && !isLiveMode) {
    throw new Error(
      "STRIPE_SECRET_KEY must start with sk_test_ (test mode) or sk_live_ (live mode)"
    );
  }
  if (process.env.NODE_ENV !== "test") {
    console.log(`[Stripe] Running in ${isLiveMode ? "LIVE" : "TEST"} mode`);
  }
  return new Stripe(key, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });
}

// Lazy singleton so build can complete without STRIPE_SECRET_KEY (set at runtime on Vercel)
let _stripe: Stripe | null = null;
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    if (!_stripe) _stripe = getStripe();
    return (_stripe as unknown as Record<string, unknown>)[prop as string];
  },
});

/**
 * Implementation Tier Configuration (one-time payments)
 * These should match your Stripe products/prices
 */
export const IMPLEMENTATION_TIERS = {
  basic: {
    name: "Basic",
    priceId: process.env.STRIPE_BASIC_IMPL_PRICE_ID || "price_basic_impl",
    price: 999,
    features: [
      "AWS Connect setup",
      "Basic IVR configuration",
      "Up to 5 call queues",
      "Standard business hours routing",
      "Email support during implementation",
    ],
  },
  standard: {
    name: "Standard",
    priceId: process.env.STRIPE_STANDARD_IMPL_PRICE_ID || "price_standard_impl",
    price: 2499,
    features: [
      "AWS Connect setup",
      "Advanced IVR with multi-level menus",
      "Up to 15 call queues",
      "After-hours routing and voicemail",
      "CRM integration",
      "Priority support during implementation",
    ],
  },
  premium: {
    name: "Premium",
    priceId: process.env.STRIPE_PREMIUM_IMPL_PRICE_ID || "price_premium_impl",
    price: 4999,
    features: [
      "Full AWS Connect deployment",
      "Custom contact flows",
      "Unlimited call queues",
      "Omnichannel (voice, chat, email)",
      "Custom integrations and APIs",
      "Dedicated implementation manager",
      "Staff training sessions",
    ],
  },
} as const;

/**
 * Maintenance Plan Configuration (monthly subscriptions)
 * These should match your Stripe products/prices
 */
export const MAINTENANCE_PLANS = {
  essential: {
    name: "Essential",
    priceId: process.env.STRIPE_ESSENTIAL_MAINT_PRICE_ID || "price_essential_maint",
    price: 149,
    features: ["System monitoring", "Monthly health reports", "Bug fixes", "Email support"],
  },
  professional: {
    name: "Professional",
    priceId: process.env.STRIPE_PROFESSIONAL_MAINT_PRICE_ID || "price_professional_maint",
    price: 349,
    features: [
      "24/7 system monitoring",
      "Weekly health reports",
      "Bug fixes and minor enhancements",
      "Priority support",
      "Quarterly optimization reviews",
    ],
  },
  enterprise: {
    name: "Enterprise",
    priceId: process.env.STRIPE_ENTERPRISE_MAINT_PRICE_ID || "price_enterprise_maint",
    price: 699,
    features: [
      "24/7 system monitoring with alerting",
      "Real-time dashboards",
      "Unlimited changes and enhancements",
      "Dedicated support engineer",
      "Monthly optimization reviews",
      "SLA guarantee",
    ],
  },
} as const;

// Warn if using default price IDs in non-test environments
if (
  process.env.NODE_ENV !== "test" &&
  (!process.env.STRIPE_BASIC_IMPL_PRICE_ID ||
    !process.env.STRIPE_STANDARD_IMPL_PRICE_ID ||
    !process.env.STRIPE_PREMIUM_IMPL_PRICE_ID ||
    !process.env.STRIPE_ESSENTIAL_MAINT_PRICE_ID ||
    !process.env.STRIPE_PROFESSIONAL_MAINT_PRICE_ID ||
    !process.env.STRIPE_ENTERPRISE_MAINT_PRICE_ID)
) {
  console.warn(
    "[Stripe] Warning: Using default price IDs. Set STRIPE_*_PRICE_ID environment variables."
  );
}

export type ImplementationTier = keyof typeof IMPLEMENTATION_TIERS;
export type MaintenancePlan = keyof typeof MAINTENANCE_PLANS;

/**
 * Create a Stripe customer for a new organization
 */
export async function createStripeCustomer(params: {
  email: string;
  name: string;
  organizationId: string;
}) {
  const customer = await stripe.customers.create({
    email: params.email,
    name: params.name,
    metadata: {
      organizationId: params.organizationId,
    },
  });

  return customer;
}

/**
 * Create a checkout session for one-time implementation payment
 */
export async function createImplementationCheckout(params: {
  customerId: string;
  tier: ImplementationTier;
  organizationId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const tierConfig = IMPLEMENTATION_TIERS[params.tier];

  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: tierConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      organizationId: params.organizationId,
      type: "implementation",
      tier: params.tier,
    },
  });

  return session;
}

/**
 * Create a checkout session for recurring maintenance subscription
 */
export async function createMaintenanceCheckout(params: {
  customerId: string;
  plan: MaintenancePlan;
  organizationId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const planConfig = MAINTENANCE_PLANS[params.plan];

  const session = await stripe.checkout.sessions.create({
    customer: params.customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      organizationId: params.organizationId,
      type: "maintenance",
      plan: params.plan,
    },
    subscription_data: {
      metadata: {
        organizationId: params.organizationId,
        type: "maintenance",
        plan: params.plan,
      },
    },
  });

  return session;
}

/**
 * Create a billing portal session
 * Allows customers to manage their subscription
 */
export async function createBillingPortalSession(params: {
  customerId: string;
  returnUrl: string;
}) {
  const session = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return session;
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  return subscription;
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.cancel(subscriptionId);
  return subscription;
}

/**
 * Validate Stripe webhook signature
 */
export function validateWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
