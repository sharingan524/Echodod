/**
 * API Keys Settings - List and create API keys
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { validateBody } from "@/lib/api/validation";
import { createApiKeySchema } from "@/lib/api/schemas/api-key";
import { generateApiKey } from "@/lib/api/crypto";
import { jsonCreated, jsonOk } from "@/lib/api/response";
import { audit } from "@/lib/audit";

// GET /api/settings/api-keys - List API keys (hide full hash, show prefix only)
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const apiKeys = await prisma.apiKey.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  return jsonOk(request, { data: apiKeys });
});

// POST /api/settings/api-keys - Generate new API key
export const POST = withErrorHandler(async (request: NextRequest) => {
  const { organizationId, userId } = await requireAuth(request, {
    requireOrg: true,
    minRole: "admin",
  });

  const data = await validateBody(request, createApiKeySchema);
  const { key, hash, prefix } = generateApiKey();

  const apiKey = await prisma.apiKey.create({
    data: {
      name: data.name,
      keyHash: hash,
      keyPrefix: prefix,
      organizationId,
    },
  });

  audit({
    organizationId,
    userId,
    action: "api_key.created",
    targetType: "api_key",
    targetId: apiKey.id,
    metadata: { name: data.name },
  });

  // IMPORTANT: Only return the full key once during creation
  return jsonCreated(request, {
    ...apiKey,
    key, // Full key only returned on creation
    message: "Save this API key now. You won't be able to see it again!",
  });
});
