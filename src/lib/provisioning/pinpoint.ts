/**
 * Pinpoint Provisioning
 * SMS phone number and pool setup.
 */

import * as pinpointClient from "@/lib/aws/pinpoint";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { AwsClientConfig } from "@/lib/aws/credentials";
import type { ProvisioningStep } from "./types";

/** Generate the steps needed for Pinpoint provisioning */
export function getPinpointSteps(): ProvisioningStep[] {
  return [
    {
      id: "pinpoint.create_pool",
      name: "Create SMS Pool and Number",
      service: "pinpoint",
      status: "pending",
    },
    {
      id: "pinpoint.check_limits",
      name: "Verify Account Limits",
      service: "pinpoint",
      status: "pending",
    },
  ];
}

/** Execute a single Pinpoint provisioning step */
export async function executePinpointStep(
  config: AwsClientConfig,
  step: ProvisioningStep,
  context: {
    organizationId: string;
    organizationSlug: string;
    previousResults: Record<string, unknown>;
  }
): Promise<{ result?: Record<string, unknown>; error?: string }> {
  switch (step.id) {
    case "pinpoint.create_pool": {
      const pool = await pinpointClient.createPool(config, {
        isoCountryCode: "US",
        messageType: "TRANSACTIONAL",
      });

      await prisma.serviceConfig.updateMany({
        where: {
          organizationId: context.organizationId,
          serviceType: "pinpoint",
        },
        data: {
          status: "configuring",
          configDetails: {
            poolId: pool.poolId,
            poolArn: pool.poolArn,
            phoneNumberId: pool.phoneNumberId,
            phoneNumber: pool.phoneNumber,
          },
        },
      });

      // Store SMS number in PhoneNumber model
      if (pool.phoneNumber) {
        await prisma.phoneNumber.create({
          data: {
            phoneNumber: pool.phoneNumber,
            provider: "pinpoint",
            providerSid: pool.phoneNumberId,
            isActive: true,
            organizationId: context.organizationId,
          },
        });
      }

      logger.info("Pinpoint pool provisioned", {
        organizationId: context.organizationId,
        poolId: pool.poolId,
      });

      return {
        result: {
          poolId: pool.poolId,
          phoneNumber: pool.phoneNumber,
        },
      };
    }

    case "pinpoint.check_limits": {
      const limits = await pinpointClient.getAccountLimits(config);
      return { result: { limits } };
    }

    default:
      return { error: `Unknown step: ${step.id}` };
  }
}
