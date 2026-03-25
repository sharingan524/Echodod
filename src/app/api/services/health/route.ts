/**
 * Service Health API
 * Checks real-time status of AWS services for the authenticated org.
 *
 * GET /api/services/health
 */

import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api/auth";
import { withErrorHandler } from "@/lib/api/error-handler";
import { jsonOk } from "@/lib/api/response";
import { prisma } from "@/lib/db";
import { getClientConfig } from "@/lib/aws/credentials";
import * as connectClient from "@/lib/aws/connect";
import * as sesClient from "@/lib/aws/ses";

interface ServiceHealth {
  service: string;
  status: "healthy" | "degraded" | "unhealthy" | "unknown";
  details?: Record<string, unknown>;
  checkedAt: string;
}

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { organizationId } = await requireAuth(request, {
    requireOrg: true,
  });

  const configs = await prisma.serviceConfig.findMany({
    where: { organizationId, status: "active" },
  });

  if (configs.length === 0) {
    return jsonOk(request, { services: [], message: "No active services" });
  }

  let awsConfig;
  try {
    awsConfig = await getClientConfig(organizationId);
  } catch {
    return jsonOk(request, {
      services: configs.map((c: { serviceType: string }) => ({
        service: c.serviceType,
        status: "unknown" as const,
        details: { error: "AWS credentials not available" },
        checkedAt: new Date().toISOString(),
      })),
    });
  }

  const healthChecks: ServiceHealth[] = [];

  for (const config of configs) {
    try {
      const details =
        (config.configDetails as Record<string, unknown>) || {};

      switch (config.serviceType) {
        case "connect": {
          const instanceId = details.instanceId as string;
          if (instanceId) {
            const instance = await connectClient.describeInstance(
              awsConfig,
              instanceId
            );
            healthChecks.push({
              service: "connect",
              status:
                instance?.InstanceStatus === "ACTIVE"
                  ? "healthy"
                  : "degraded",
              details: {
                instanceStatus: instance?.InstanceStatus,
                instanceAlias: instance?.InstanceAlias,
              },
              checkedAt: new Date().toISOString(),
            });
          }
          break;
        }
        case "ses": {
          const domain = details.domain as string;
          if (domain) {
            const domainStatus = await sesClient.getDomainStatus(
              awsConfig,
              domain
            );
            healthChecks.push({
              service: "ses",
              status: domainStatus.verifiedForSending
                ? "healthy"
                : "degraded",
              details: {
                domain,
                verifiedForSending: domainStatus.verifiedForSending,
                dkimStatus: domainStatus.dkimStatus,
              },
              checkedAt: new Date().toISOString(),
            });
          }
          break;
        }
        default:
          healthChecks.push({
            service: config.serviceType,
            status: "unknown",
            checkedAt: new Date().toISOString(),
          });
      }
    } catch (err) {
      healthChecks.push({
        service: config.serviceType,
        status: "unhealthy",
        details: {
          error: err instanceof Error ? err.message : "Check failed",
        },
        checkedAt: new Date().toISOString(),
      });
    }
  }

  return jsonOk(request, { services: healthChecks });
});
