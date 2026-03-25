/**
 * Dashboard Metrics API - Real-time analytics for communication services
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";

// GET /api/dashboard/metrics
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  // Parallel queries for performance
  const [
    communicationsToday,
    communicationsYesterday,
    activeChannels,
    billingInfo,
    recentActivity,
  ] = await Promise.all([
    // Communications today
    prisma.communicationLog.count({
      where: {
        organizationId,
        createdAt: { gte: todayStart },
      },
    }),

    // Communications yesterday
    prisma.communicationLog.count({
      where: {
        organizationId,
        createdAt: {
          gte: yesterdayStart,
          lt: todayStart,
        },
      },
    }),

    // Active channels (service configs with active status)
    prisma.serviceConfig.count({
      where: {
        organizationId,
        status: "active",
      },
    }),

    // Service status from billing info
    prisma.billingInfo.findUnique({
      where: { organizationId },
      select: { serviceStatus: true },
    }),

    // Recent activity (last 10 communications)
    prisma.communicationLog.findMany({
      where: { organizationId },
      take: 10,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        channel: true,
        direction: true,
        contactInfo: true,
        subject: true,
        content: true,
        outcome: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  // Calculate change percentage
  const change =
    communicationsYesterday > 0
      ? ((communicationsToday - communicationsYesterday) / communicationsYesterday) * 100
      : 0;
  const changeStr = `${change >= 0 ? "+" : ""}${change.toFixed(1)}% from yesterday`;

  return jsonOk(request, {
    metrics: {
      communicationsToday: {
        value: communicationsToday,
        change: changeStr,
      },
      activeChannels: {
        value: activeChannels,
      },
      serviceStatus: {
        value: billingInfo?.serviceStatus || "pending",
      },
    },
    recentActivity,
  });
});
