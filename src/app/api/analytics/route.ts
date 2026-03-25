/**
 * Analytics API - Aggregated communication metrics for charts
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";

// GET /api/analytics?days=30
export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, { requireOrg: true });

  const days = Math.min(Number(request.nextUrl.searchParams.get("days") || "30"), 90);
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const [communicationLogs, totalCommunications, avgDuration] = await Promise.all([
    // Raw communication data for aggregation
    prisma.communicationLog.findMany({
      where: {
        organizationId,
        createdAt: { gte: since },
      },
      select: {
        createdAt: true,
        channel: true,
        outcome: true,
        duration: true,
        status: true,
      },
      orderBy: { createdAt: "asc" },
    }),

    // Total communications all-time
    prisma.communicationLog.count({ where: { organizationId } }),

    // Average duration (for channels that have duration)
    prisma.communicationLog.aggregate({
      where: {
        organizationId,
        createdAt: { gte: since },
        duration: { not: null },
      },
      _avg: { duration: true },
    }),
  ]);

  // --- Communication volume by day ---
  const volumeByDay: Record<string, number> = {};
  for (let d = 0; d < days; d++) {
    const date = new Date(since);
    date.setDate(date.getDate() + d);
    volumeByDay[date.toISOString().slice(0, 10)] = 0;
  }
  for (const log of communicationLogs) {
    const key = log.createdAt.toISOString().slice(0, 10);
    if (key in volumeByDay) {
      volumeByDay[key]++;
    }
  }
  const communicationVolume = Object.entries(volumeByDay).map(([date, count]) => ({
    date,
    count,
  }));

  // --- Channel distribution ---
  const channelCounts: Record<string, number> = {};
  for (const log of communicationLogs) {
    const channel = log.channel || "unknown";
    channelCounts[channel] = (channelCounts[channel] || 0) + 1;
  }
  const channelDistribution = Object.entries(channelCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // --- Outcome breakdown ---
  const outcomeCounts: Record<string, number> = {};
  for (const log of communicationLogs) {
    const outcome = log.outcome || "unknown";
    outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1;
  }
  const outcomeBreakdown = Object.entries(outcomeCounts).map(([name, value]) => ({ name, value }));

  // --- Communications by hour of day ---
  const hourCounts = new Array(24).fill(0);
  for (const log of communicationLogs) {
    hourCounts[log.createdAt.getHours()]++;
  }
  const communicationsByHour = hourCounts.map((count, hour) => ({
    hour: `${hour.toString().padStart(2, "0")}:00`,
    count,
  }));

  // --- Success rate (resolved + delivered vs total) ---
  const successCount = communicationLogs.filter(
    (l: { outcome: string }) => l.outcome === "resolved" || l.outcome === "delivered"
  ).length;

  return jsonOk(request, {
    summary: {
      totalCommunications,
      periodCommunications: communicationLogs.length,
      avgDuration: Math.round(avgDuration._avg.duration || 0),
      successRate:
        communicationLogs.length > 0
          ? Math.round((successCount / communicationLogs.length) * 100)
          : 0,
    },
    communicationVolume,
    channelDistribution,
    outcomeBreakdown,
    communicationsByHour,
  });
});
