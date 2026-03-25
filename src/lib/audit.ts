/**
 * Audit logging helper — records organization-level actions
 */

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { Prisma } from "@prisma/client";

interface AuditEntry {
  organizationId: string;
  userId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Prisma.InputJsonValue;
  ipAddress?: string;
}

/**
 * Record an audit log entry.
 * Fire-and-forget — never throws or blocks the caller.
 */
export function audit(entry: AuditEntry) {
  prisma.auditLog
    .create({
      data: {
        organizationId: entry.organizationId,
        userId: entry.userId,
        action: entry.action,
        targetType: entry.targetType ?? null,
        targetId: entry.targetId ?? null,
        metadata: entry.metadata ?? undefined,
        ipAddress: entry.ipAddress ?? null,
      },
    })
    .catch((err: unknown) => {
      logger.warn("Failed to write audit log", { action: entry.action, error: String(err) });
    });
}
