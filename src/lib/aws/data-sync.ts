/**
 * AWS Data Sync
 * Pulls real communication data from AWS services into the CommunicationLog table.
 * Designed to be called by a cron job every 15 minutes.
 */

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getClientConfig } from "./credentials";
import * as cloudwatchClient from "./cloudwatch";
import type { AwsClientConfig } from "./credentials";

interface SyncResult {
  organizationId: string;
  service: string;
  recordsSynced: number;
  errors: string[];
}

/** Sync all active organizations */
export async function syncAllOrganizations(): Promise<SyncResult[]> {
  const activeConfigs = await prisma.serviceConfig.findMany({
    where: { status: "active" },
    include: { organization: true },
  });

  // Group by organization
  const orgMap = new Map<string, typeof activeConfigs>();
  for (const config of activeConfigs) {
    const list = orgMap.get(config.organizationId) || [];
    list.push(config);
    orgMap.set(config.organizationId, list);
  }

  const results: SyncResult[] = [];

  for (const [organizationId, configs] of orgMap) {
    let awsConfig: AwsClientConfig;
    try {
      awsConfig = await getClientConfig(organizationId);
    } catch {
      logger.warn("Skipping sync for org without valid credentials", {
        organizationId,
      });
      continue;
    }

    for (const serviceConfig of configs) {
      try {
        const result = await syncService(
          awsConfig,
          serviceConfig,
          organizationId
        );
        results.push(result);
      } catch (err) {
        logger.error(
          "Sync failed for service",
          {
            organizationId,
            serviceType: serviceConfig.serviceType,
          },
          err
        );
        results.push({
          organizationId,
          service: serviceConfig.serviceType,
          recordsSynced: 0,
          errors: [err instanceof Error ? err.message : "Unknown error"],
        });
      }
    }
  }

  return results;
}

async function syncService(
  config: AwsClientConfig,
  serviceConfig: {
    serviceType: string;
    configDetails: unknown;
    organizationId: string;
  },
  organizationId: string
): Promise<SyncResult> {
  const details = (serviceConfig.configDetails as Record<string, unknown>) || {};

  switch (serviceConfig.serviceType) {
    case "connect":
      return syncConnectData(config, organizationId, details);
    case "ses":
      return syncSesData(config, organizationId);
    case "pinpoint":
      return syncPinpointData(config, organizationId);
    default:
      return {
        organizationId,
        service: serviceConfig.serviceType,
        recordsSynced: 0,
        errors: [],
      };
  }
}

/** Sync Connect contact records via CloudWatch */
async function syncConnectData(
  config: AwsClientConfig,
  organizationId: string,
  details: Record<string, unknown>
): Promise<SyncResult> {
  const instanceId = details?.instanceId as string;
  if (!instanceId) {
    return {
      organizationId,
      service: "connect",
      recordsSynced: 0,
      errors: ["No instanceId in config"],
    };
  }

  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const metrics = await cloudwatchClient.getConnectMetrics(config, {
    instanceId,
    startTime: fifteenMinutesAgo,
    endTime: now,
    period: 300,
  });

  let recordsSynced = 0;

  for (const metricResult of metrics) {
    if (metricResult.Id === "contacts_handled" && metricResult.Values) {
      for (let i = 0; i < metricResult.Values.length; i++) {
        const count = metricResult.Values[i];
        const timestamp = metricResult.Timestamps?.[i];
        if (count && count > 0 && timestamp) {
          const externalId = `connect-${instanceId}-${timestamp.toISOString()}-handled`;

          await prisma.communicationLog.upsert({
            where: { externalId },
            update: {},
            create: {
              externalId,
              channel: "phone",
              direction: "inbound",
              contactInfo: "Connect Instance",
              content: `${count} calls handled`,
              duration: null,
              outcome: "resolved",
              status: "completed",
              provider: "aws-connect",
              organizationId,
              metadata: {
                metricType: "contacts_handled",
                count,
                instanceId,
              },
              createdAt: timestamp,
            },
          });
          recordsSynced++;
        }
      }
    }
  }

  return { organizationId, service: "connect", recordsSynced, errors: [] };
}

/** Sync SES sending events via CloudWatch */
async function syncSesData(
  config: AwsClientConfig,
  organizationId: string
): Promise<SyncResult> {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const metrics = await cloudwatchClient.getSesMetrics(config, {
    startTime: fifteenMinutesAgo,
    endTime: now,
    period: 300,
  });

  let recordsSynced = 0;

  for (const metricResult of metrics) {
    if (metricResult.Values) {
      for (let i = 0; i < metricResult.Values.length; i++) {
        const count = metricResult.Values[i];
        const timestamp = metricResult.Timestamps?.[i];
        if (count && count > 0 && timestamp) {
          const metricName = metricResult.Id || "unknown";
          const externalId = `ses-${metricName}-${timestamp.toISOString()}`;

          const outcome = metricName.includes("bounce")
            ? "bounced"
            : metricName.includes("complaint")
              ? "escalated"
              : "delivered";
          const status =
            metricName.includes("bounce") || metricName.includes("complaint")
              ? "failed"
              : "completed";

          await prisma.communicationLog.upsert({
            where: { externalId },
            update: {},
            create: {
              externalId,
              channel: "email",
              direction: "outbound",
              contactInfo: "SES Aggregate",
              content: `${count} emails — ${metricName}`,
              outcome,
              status,
              provider: "aws-connect",
              organizationId,
              metadata: { metricType: metricName, count },
              createdAt: timestamp,
            },
          });
          recordsSynced++;
        }
      }
    }
  }

  return { organizationId, service: "ses", recordsSynced, errors: [] };
}

/** Sync Pinpoint SMS delivery data via CloudWatch */
async function syncPinpointData(
  config: AwsClientConfig,
  organizationId: string
): Promise<SyncResult> {
  const now = new Date();
  const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

  const metrics = await cloudwatchClient.getPinpointMetrics(config, {
    startTime: fifteenMinutesAgo,
    endTime: now,
    period: 300,
  });

  let recordsSynced = 0;

  for (const metricResult of metrics) {
    if (metricResult.Values) {
      for (let i = 0; i < metricResult.Values.length; i++) {
        const count = metricResult.Values[i];
        const timestamp = metricResult.Timestamps?.[i];
        if (count && count > 0 && timestamp) {
          const externalId = `pinpoint-sms-${timestamp.toISOString()}`;

          await prisma.communicationLog.upsert({
            where: { externalId },
            update: {},
            create: {
              externalId,
              channel: "sms",
              direction: "outbound",
              contactInfo: "Pinpoint Aggregate",
              content: `SMS activity metric: ${count}`,
              outcome: "delivered",
              status: "completed",
              provider: "pinpoint",
              organizationId,
              metadata: { metricType: "sms_spend", count },
              createdAt: timestamp,
            },
          });
          recordsSynced++;
        }
      }
    }
  }

  return { organizationId, service: "pinpoint", recordsSynced, errors: [] };
}
