import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/api/errors";

export const DELETE = withErrorHandler(
  async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { organizationId } = await requireAuth(request, {
      requireOrg: true,
    });

    const { id } = await params;

    const holiday = await prisma.holidaySchedule.findFirst({
      where: { id, organizationId },
    });

    if (!holiday) {
      throw new NotFoundError("Holiday not found");
    }

    await prisma.holidaySchedule.delete({ where: { id } });

    return new Response(null, { status: 204 });
  }
);
