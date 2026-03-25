import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";
import { prisma } from "@/lib/db";

export const GET = withErrorHandler(async (request: Request) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  const services = await prisma.serviceConfig.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  return jsonOk(request, services);
});
