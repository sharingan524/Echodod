/**
 * API Keys Settings - Delete individual API key
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { NotFoundError } from "@/lib/api/errors";
import { jsonOk } from "@/lib/api/response";

// DELETE /api/settings/api-keys/:id - Revoke API key
export const DELETE = withErrorHandler(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { organizationId } = await requireAuth(request, {
      requireOrg: true,
      minRole: "admin",
    });
    const { id } = await params;

    const deleted = await prisma.apiKey.deleteMany({
      where: {
        id,
        organizationId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundError("API Key");
    }

    return jsonOk(request, null);
  }
);
