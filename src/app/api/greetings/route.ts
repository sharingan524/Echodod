import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { updateGreetingsSchema } from "@/lib/api/schemas/greeting";
import { BadRequestError } from "@/lib/api/errors";

export const GET = withErrorHandler(async (request: Request) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  const greetings = await prisma.greetingMessage.findMany({
    where: { organizationId },
    orderBy: { channel: "asc" },
  });

  return jsonOk(request, greetings);
});

export const PUT = withErrorHandler(async (request: Request) => {
  const { userId, organizationId } = await requireAuth(request, {
    requireOrg: true,
  });

  const body = await request.json();
  const parsed = updateGreetingsSchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError("Invalid greeting data", {
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const results = await prisma.$transaction(
    parsed.data.greetings.map((g) =>
      prisma.greetingMessage.upsert({
        where: {
          organizationId_channel: {
            organizationId,
            channel: g.channel,
          },
        },
        update: {
          message: g.message,
          isActive: g.isActive,
        },
        create: {
          organizationId,
          channel: g.channel,
          message: g.message,
          isActive: g.isActive,
        },
      })
    )
  );

  audit({
    organizationId,
    userId,
    action: "greeting.updated",
    targetType: "greeting",
  });

  return jsonOk(request, results);
});
