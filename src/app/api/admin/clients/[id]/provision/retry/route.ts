/**
 * Retry a failed provisioning plan
 *
 * POST /api/admin/clients/:id/provision/retry
 */

import { NextRequest } from "next/server";
import { requireSuperAdmin } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { BadRequestError } from "@/lib/api/errors";
import { jsonOk } from "@/lib/api/response";
import { retryProvisioningPlan } from "@/lib/provisioning/orchestrator";
import { logger } from "@/lib/logger";

export const POST = withErrorHandler(async (request: NextRequest) => {
  await requireSuperAdmin();

  const body = (await request.json()) as { ticketId?: string };
  const { ticketId } = body;

  if (!ticketId) {
    throw new BadRequestError("ticketId is required");
  }

  // Execute retry asynchronously
  retryProvisioningPlan(ticketId).catch((err) => {
    logger.error("Provisioning retry failed", { ticketId }, err);
  });

  return jsonOk(request, { message: "Retry started", ticketId });
});
