/**
 * Claim a phone number from AWS Connect
 *
 * POST /api/settings/phone-numbers/claim
 */

import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonCreated } from "@/lib/api/response";
import { getClientConfig } from "@/lib/aws/credentials";
import * as connectClient from "@/lib/aws/connect";
import { prisma } from "@/lib/db";
import { BadRequestError } from "@/lib/api/errors";
import { audit } from "@/lib/audit";
import { z } from "zod";
import { validateBody } from "@/lib/api/validation";

const claimSchema = z.object({
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  description: z.string().max(256).optional(),
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { organizationId, userId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const body = await validateBody(request, claimSchema);

  const connectConfig = await prisma.serviceConfig.findFirst({
    where: { organizationId, serviceType: "connect", status: "active" },
  });

  if (!connectConfig) {
    throw new BadRequestError("No active Connect instance found");
  }

  const details =
    (connectConfig.configDetails as Record<string, unknown>) || {};
  const instanceArn = details.instanceArn as string;
  if (!instanceArn) {
    throw new BadRequestError(
      "Connect instance ARN not found in configuration"
    );
  }

  const awsConfig = await getClientConfig(organizationId);

  const claimed = await connectClient.claimPhoneNumber(awsConfig, {
    targetArn: instanceArn,
    phoneNumber: body.phoneNumber,
    description: body.description,
  });

  // Store in local database
  const phoneNumber = await prisma.phoneNumber.create({
    data: {
      phoneNumber: body.phoneNumber,
      provider: "aws-connect",
      providerSid: claimed.phoneNumberId,
      isActive: true,
      organizationId,
    },
  });

  audit({
    organizationId,
    userId,
    action: "phone_number.claimed",
    targetType: "phone_number",
    targetId: phoneNumber.id,
    metadata: { phoneNumber: body.phoneNumber },
  });

  return jsonCreated(request, phoneNumber);
});
