/**
 * Health Check Endpoint
 * Validates connectivity to PostgreSQL and Redis.
 * Returns per-component status so monitoring tools can detect partial failures.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

type ComponentStatus = {
  status: "ok" | "error";
  latencyMs?: number;
  error?: string;
};

export async function GET() {
  const components: Record<string, ComponentStatus> = {};
  let overallStatus: "ok" | "degraded" | "error" = "ok";

  // --- Database (PostgreSQL via Prisma) ---
  const dbStart = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    components.database = { status: "ok", latencyMs: Date.now() - dbStart };
  } catch (err) {
    components.database = {
      status: "error",
      latencyMs: Date.now() - dbStart,
      error: err instanceof Error ? err.message : "Unknown error",
    };
    overallStatus = "error";
  }

  // --- Redis ---
  const redisStart = Date.now();
  try {
    const Redis = (await import("ioredis")).default;
    const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
    });
    await redis.connect();
    await redis.ping();
    components.redis = { status: "ok", latencyMs: Date.now() - redisStart };
    await redis.quit();
  } catch (err) {
    components.redis = {
      status: "error",
      latencyMs: Date.now() - redisStart,
      error: err instanceof Error ? err.message : "Unknown error",
    };
    if (overallStatus === "ok") overallStatus = "degraded";
  }

  const payload = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    components,
  };

  if (overallStatus === "error") {
    logger.error("Health check failed", { components });
  }

  return NextResponse.json(payload, {
    status: overallStatus === "error" ? 503 : 200,
  });
}
