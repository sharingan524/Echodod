import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { updateBusinessHoursSchema } from "@/lib/api/schemas/business-hours";
import { BadRequestError } from "@/lib/api/errors";

const DEFAULT_HOURS = [
  { dayOfWeek: 0, openTime: "09:00", closeTime: "17:00", isClosed: true },
  { dayOfWeek: 1, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: 2, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: 3, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: 4, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: 5, openTime: "09:00", closeTime: "17:00", isClosed: false },
  { dayOfWeek: 6, openTime: "09:00", closeTime: "17:00", isClosed: true },
];

export const GET = withErrorHandler(async (request: Request) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  let hours = await prisma.businessHours.findMany({
    where: { organizationId },
    orderBy: { dayOfWeek: "asc" },
  });

  if (hours.length === 0) {
    await prisma.businessHours.createMany({
      data: DEFAULT_HOURS.map((h) => ({ ...h, organizationId })),
    });
    hours = await prisma.businessHours.findMany({
      where: { organizationId },
      orderBy: { dayOfWeek: "asc" },
    });
  }

  return jsonOk(request, hours);
});

export const PUT = withErrorHandler(async (request: Request) => {
  const { userId, organizationId } = await requireAuth(request, {
    requireOrg: true,
  });

  const body = await request.json();
  const parsed = updateBusinessHoursSchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError("Invalid business hours data", {
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const results = await prisma.$transaction(
    parsed.data.hours.map((h) =>
      prisma.businessHours.upsert({
        where: {
          organizationId_dayOfWeek: {
            organizationId,
            dayOfWeek: h.dayOfWeek,
          },
        },
        update: {
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        },
        create: {
          organizationId,
          dayOfWeek: h.dayOfWeek,
          openTime: h.openTime,
          closeTime: h.closeTime,
          isClosed: h.isClosed,
        },
      })
    )
  );

  audit({
    organizationId,
    userId,
    action: "business_hours.updated",
    targetType: "business_hours",
  });

  return jsonOk(request, results);
});
