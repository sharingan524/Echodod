/**
 * Webhooks Settings - Update and delete individual webhook
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateBody } from "@/lib/api/validation";
import { updateWebhookSchema } from "@/lib/api/schemas/webhook";
import { NotFoundError } from "@/lib/api/errors";
import { jsonOk } from "@/lib/api/response";

// PATCH /api/settings/webhooks/:id - Update webhook
export const PATCH = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { organizationId } = await requireAuth(request, {
      requireOrg: true,
      minRole: "admin",
    });
    const { id } = await params;

    const data = await validateBody(request, updateWebhookSchema);

    const result = await prisma.webhook.updateMany({
      where: {
        id,
        organizationId,
      },
      data,
    });

    if (result.count === 0) {
      throw new NotFoundError("Webhook");
    }

    const updated = await prisma.webhook.findUnique({
      where: { id },
    });

    return jsonOk(request, updated);
  }
);

// DELETE /api/settings/webhooks/:id - Delete webhook
export const DELETE = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { organizationId } = await requireAuth(request, {
      requireOrg: true,
      minRole: "admin",
    });
    const { id } = await params;

    const deleted = await prisma.webhook.deleteMany({
      where: {
        id,
        organizationId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundError("Webhook");
    }

    return jsonOk(request, null);
  }
);
