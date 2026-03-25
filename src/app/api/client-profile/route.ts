import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { updateClientProfileSchema } from "@/lib/api/schemas/client-profile";
import { BadRequestError } from "@/lib/api/errors";

export const GET = withErrorHandler(async (request: Request) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  let profile = await prisma.clientProfile.findUnique({
    where: { organizationId },
  });

  if (!profile) {
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
    });
    profile = await prisma.clientProfile.create({
      data: {
        organizationId,
        businessName: org?.name || "My Business",
      },
    });
  }

  return jsonOk(request, profile);
});

export const PATCH = withErrorHandler(async (request: Request) => {
  const { userId, organizationId } = await requireAuth(request, {
    requireOrg: true,
  });

  const body = await request.json();
  const parsed = updateClientProfileSchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError("Invalid profile data", {
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const profile = await prisma.clientProfile.upsert({
    where: { organizationId },
    update: parsed.data,
    create: {
      organizationId,
      businessName: parsed.data.businessName || "My Business",
      ...parsed.data,
    },
  });

  audit({
    organizationId,
    userId,
    action: "profile.updated",
    targetType: "profile",
    targetId: profile.id,
  });

  return jsonOk(request, profile);
});
