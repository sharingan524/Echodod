/**
 * Webhooks Settings - List and create webhooks
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateBody } from "@/lib/api/validation";
import { createWebhookSchema } from "@/lib/api/schemas/webhook";
import { generateWebhookSecret } from "@/lib/api/crypto";
import { jsonCreated, jsonOk } from "@/lib/api/response";

// GET /api/settings/webhooks - List webhooks
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const webhooks = await prisma.webhook.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk(request, { data: webhooks });
});

// POST /api/settings/webhooks - Create webhook with secret
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const data = await validateBody(request, createWebhookSchema);
  const secret = generateWebhookSecret();

  const webhook = await prisma.webhook.create({
    data: {
      url: data.url,
      events: data.events,
      secret,
      isActive: true,
      organizationId,
    },
  });

  return jsonCreated(request, webhook);
});
