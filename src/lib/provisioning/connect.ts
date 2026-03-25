/**
 * Connect Provisioning
 * Step-by-step Amazon Connect instance setup.
 */

import * as connectClient from "@/lib/aws/connect";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { AwsClientConfig } from "@/lib/aws/credentials";
import type { ProvisioningStep } from "./types";

/** Generate the steps needed for Connect provisioning */
export function getConnectSteps(): ProvisioningStep[] {
  return [
    {
      id: "connect.create_instance",
      name: "Create Connect Instance",
      service: "connect",
      status: "pending",
    },
    {
      id: "connect.wait_instance_active",
      name: "Wait for Instance Activation",
      service: "connect",
      status: "pending",
    },
    {
      id: "connect.create_default_queue",
      name: "Create Default Queue",
      service: "connect",
      status: "pending",
    },
    {
      id: "connect.create_basic_flow",
      name: "Create Basic Contact Flow",
      service: "connect",
      status: "pending",
    },
    {
      id: "connect.claim_phone_number",
      name: "Claim Phone Number",
      service: "connect",
      status: "pending",
    },
  ];
}

/** Execute a single Connect provisioning step */
export async function executeConnectStep(
  config: AwsClientConfig,
  step: ProvisioningStep,
  context: {
    organizationId: string;
    organizationSlug: string;
    previousResults: Record<string, unknown>;
  }
): Promise<{ result?: Record<string, unknown>; error?: string }> {
  switch (step.id) {
    case "connect.create_instance": {
      const alias = `sv-${context.organizationSlug}-${Date.now()}`
        .substring(0, 45)
        .replace(/[^a-zA-Z0-9-]/g, "-");

      const instance = await connectClient.createInstance(config, {
        instanceAlias: alias,
      });

      // Store instance ID in ServiceConfig
      await prisma.serviceConfig.updateMany({
        where: {
          organizationId: context.organizationId,
          serviceType: "connect",
        },
        data: {
          status: "configuring",
          configDetails: {
            instanceId: instance.instanceId,
            instanceArn: instance.arn,
            instanceAlias: alias,
          },
        },
      });

      return {
        result: {
          instanceId: instance.instanceId,
          instanceArn: instance.arn,
          instanceAlias: alias,
        },
      };
    }

    case "connect.wait_instance_active": {
      const instanceId = context.previousResults.instanceId as string;
      // Poll for up to 5 minutes (instance creation can take 2-3 minutes)
      const maxAttempts = 30;
      for (let i = 0; i < maxAttempts; i++) {
        const instance = await connectClient.describeInstance(config, instanceId);
        if (instance?.InstanceStatus === "ACTIVE") {
          return { result: { instanceStatus: "ACTIVE" } };
        }
        logger.debug("Waiting for Connect instance to become active", {
          instanceId,
          attempt: i + 1,
          status: instance?.InstanceStatus,
        });
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
      return {
        error: "Connect instance did not become active within 5 minutes. Check AWS Console.",
      };
    }

    case "connect.create_default_queue": {
      const instanceId = context.previousResults.instanceId as string;

      // Get the default hours of operation
      const hoursList = await connectClient.listHoursOfOperations(config, instanceId);
      const defaultHours = hoursList[0];
      if (!defaultHours?.Id) {
        return {
          error: "No hours of operation found. The instance may still be initializing.",
        };
      }

      const queue = await connectClient.createQueue(config, {
        instanceId,
        name: "Main Queue",
        description: "Primary call queue — auto-provisioned by Echodod",
        hoursOfOperationId: defaultHours.Id,
      });

      return {
        result: {
          queueId: queue.queueId,
          queueArn: queue.queueArn,
          hoursOfOperationId: defaultHours.Id,
        },
      };
    }

    case "connect.create_basic_flow": {
      const instanceId = context.previousResults.instanceId as string;

      // Basic IVR: answer → play prompt → transfer to queue
      const flowContent = JSON.stringify({
        Version: "2019-10-30",
        StartAction: "welcome",
        Actions: [
          {
            Identifier: "welcome",
            Type: "MessageParticipant",
            Parameters: {
              Text: "Thank you for calling. Please hold while we connect you to an agent.",
            },
            Transitions: {
              NextAction: "transfer",
              Errors: [{ NextAction: "disconnect" }],
            },
          },
          {
            Identifier: "transfer",
            Type: "TransferContactToQueue",
            Parameters: {},
            Transitions: {
              NextAction: "disconnect",
              Errors: [{ NextAction: "disconnect" }],
            },
          },
          {
            Identifier: "disconnect",
            Type: "DisconnectParticipant",
            Parameters: {},
            Transitions: {},
          },
        ],
      });

      const flow = await connectClient.createContactFlow(config, {
        instanceId,
        name: "Basic Inbound Flow",
        type: "CONTACT_FLOW",
        content: flowContent,
        description: "Auto-provisioned basic inbound contact flow",
      });

      return {
        result: {
          contactFlowId: flow.contactFlowId,
          contactFlowArn: flow.contactFlowArn,
        },
      };
    }

    case "connect.claim_phone_number": {
      const instanceArn = context.previousResults.instanceArn as string;

      const available = await connectClient.searchAvailablePhoneNumbers(config, {
        targetArn: instanceArn,
        countryCode: "US",
        type: "DID",
        maxResults: 1,
      });

      if (available.length === 0) {
        return {
          error:
            "No phone numbers available in this region. Try a different region or request a number manually.",
        };
      }

      const claimed = await connectClient.claimPhoneNumber(config, {
        targetArn: instanceArn,
        phoneNumber: available[0].PhoneNumber!,
        description: "Auto-provisioned primary number",
      });

      // Store in PhoneNumber model
      await prisma.phoneNumber.create({
        data: {
          phoneNumber: available[0].PhoneNumber!,
          provider: "aws-connect",
          providerSid: claimed.phoneNumberId,
          isActive: true,
          organizationId: context.organizationId,
        },
      });

      return {
        result: {
          phoneNumberId: claimed.phoneNumberId,
          phoneNumber: available[0].PhoneNumber,
        },
      };
    }

    default:
      return { error: `Unknown step: ${step.id}` };
  }
}
