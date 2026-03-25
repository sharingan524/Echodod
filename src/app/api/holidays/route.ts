import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk, jsonCreated } from "@/lib/api/response";
import { prisma } from "@/lib/db";
import { createHolidaySchema } from "@/lib/api/schemas/holiday";
import { BadRequestError } from "@/lib/api/errors";

export const GET = withErrorHandler(async (request: Request) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  const holidays = await prisma.holidaySchedule.findMany({
    where: { organizationId },
    orderBy: { date: "asc" },
  });

  return jsonOk(request, holidays);
});

export const POST = withErrorHandler(async (request: Request) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  const body = await request.json();
  const parsed = createHolidaySchema.safeParse(body);

  if (!parsed.success) {
    throw new BadRequestError("Invalid holiday data", {
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const holiday = await prisma.holidaySchedule.create({
    data: {
      organizationId,
      ...parsed.data,
    },
  });

  return jsonCreated(request, holiday);
});
