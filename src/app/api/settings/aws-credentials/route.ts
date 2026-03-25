/**
 * AWS Credentials API — Store and validate per-org AWS credentials
 *
 * GET  /api/settings/aws-credentials — Get credential status (never returns secrets)
 * POST /api/settings/aws-credentials — Store new credentials (owner-only)
 */

import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateBody } from "@/lib/api/validation";
import { storeCredentialsSchema } from "@/lib/api/schemas/aws-credentials";
import { storeClientCredentials } from "@/lib/aws/credentials";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { jsonOk, jsonCreated } from "@/lib/api/response";

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const credential = await prisma.awsCredential.findUnique({
    where: { organizationId },
    select: {
      id: true,
      region: true,
      accountId: true,
      isValid: true,
      lastValidatedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return jsonOk(request, credential);
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const { organizationId, userId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "owner",
  });

  const data = await validateBody(request, storeCredentialsSchema);

  const result = await storeClientCredentials({
    organizationId,
    accessKeyId: data.accessKeyId,
    secretAccessKey: data.secretAccessKey,
    region: data.region,
  });

  if (!result.success) {
    return jsonOk(request, {
      success: false,
      error: result.error,
    });
  }

  audit({
    organizationId,
    userId,
    action: "aws_credentials.stored",
    targetType: "aws_credential",
    metadata: { region: data.region, accountId: result.accountId },
  });

  return jsonCreated(request, {
    success: true,
    accountId: result.accountId,
    region: data.region,
  });
});
