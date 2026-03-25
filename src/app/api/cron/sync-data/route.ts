/**
 * Cron Data Sync Endpoint
 * Triggered by Vercel Cron or external scheduler every 15 minutes.
 * Pulls AWS data into CommunicationLog for all active organizations.
 *
 * Protected by a shared secret in the Authorization header.
 */

import { NextRequest, NextResponse } from "next/server";
import { syncAllOrganizations } from "@/lib/aws/data-sync";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await syncAllOrganizations();

    const summary = {
      timestamp: new Date().toISOString(),
      organizationsProcessed: new Set(results.map((r) => r.organizationId))
        .size,
      totalRecordsSynced: results.reduce(
        (sum, r) => sum + r.recordsSynced,
        0
      ),
      errors: results.filter((r) => r.errors.length > 0),
    };

    logger.info("Data sync completed", summary);
    return NextResponse.json(summary);
  } catch (err) {
    logger.error("Data sync failed", {}, err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
