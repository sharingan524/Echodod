/**
 * Search available phone numbers from AWS Connect
 *
 * GET /api/settings/phone-numbers/available?countryCode=US&type=DID
 */

import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";
import { getClientConfig } from "@/lib/aws/credentials";
import * as connectClient from "@/lib/aws/connect";
import { prisma } from "@/lib/db";
import { BadRequestError } from "@/lib/api/errors";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

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

  const countryCode =
    request.nextUrl.searchParams.get("countryCode") || "US";
  const type = request.nextUrl.searchParams.get("type") || "DID";

  const available = await connectClient.searchAvailablePhoneNumbers(
    awsConfig,
    {
      targetArn: instanceArn,
      countryCode,
      type,
      maxResults: 20,
    }
  );

  return jsonOk(request, {
    phoneNumbers: available.map((pn) => ({
      phoneNumber: pn.PhoneNumber,
      countryCode: pn.PhoneNumberCountryCode,
      type: pn.PhoneNumberType,
    })),
  });
});
