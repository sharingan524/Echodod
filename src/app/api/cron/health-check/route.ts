/**
 * Cron Health Check Endpoint
 * Triggered by Vercel Cron or external scheduler every 5 minutes.
 * Verifies DB connectivity, checks active service counts, and
 * optionally reports to Sentry on failure.
 *
 * Protected by a shared secret in the Authorization header.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const checks: Record<string, { status: string; latencyMs?: number; error?: string }> = {};

  // 1. Database connectivity check
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: "healthy", latencyMs: Date.now() - dbStart };
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB unreachable";
    checks.database = { status: "unhealthy", latencyMs: Date.now() - dbStart, error: message };
    Sentry.captureException(err, { tags: { check: "health-cron-db" } });
  }

  // 2. Active organizations count
  try {
    const orgCount = await prisma.organization.count();
    checks.organizations = { status: "healthy", latencyMs: 0 };
    checks.organizations.latencyMs = undefined;
    (checks.organizations as Record<string, unknown>).count = orgCount;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Query failed";
    checks.organizations = { status: "unhealthy", error: message };
  }

  // 3. Active services count
  try {
    const serviceCount = await prisma.serviceConfig.count({
      where: { status: "active" },
    });
    checks.activeServices = { status: "healthy" };
    (checks.activeServices as Record<string, unknown>).count = serviceCount;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Query failed";
    checks.activeServices = { status: "unhealthy", error: message };
  }

  const overall = Object.values(checks).every((c) => c.status === "healthy")
    ? "healthy"
    : "degraded";

  const result = {
    status: overall,
    timestamp: new Date().toISOString(),
    checks,
  };

  if (overall !== "healthy") {
    logger.warn("Health check degraded", result);
    Sentry.captureMessage("Health check degraded", {
      level: "warning",
      extra: result,
    });
  }

  return NextResponse.json(result, {
    status: overall === "healthy" ? 200 : 503,
  });
}
