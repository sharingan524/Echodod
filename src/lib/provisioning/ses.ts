/**
 * SES Provisioning
 * Domain verification and configuration set setup.
 */

import * as sesClient from "@/lib/aws/ses";
import { prisma } from "@/lib/db";
import type { AwsClientConfig } from "@/lib/aws/credentials";
import type { ProvisioningStep } from "./types";

/** Generate the steps needed for SES provisioning */
export function getSesSteps(): ProvisioningStep[] {
  return [
    {
      id: "ses.verify_domain",
      name: "Initiate Domain Verification",
      service: "ses",
      status: "pending",
    },
    {
      id: "ses.create_config_set",
      name: "Create Configuration Set",
      service: "ses",
      status: "pending",
    },
    {
      id: "ses.check_account_status",
      name: "Check SES Account Status",
      service: "ses",
      status: "pending",
    },
  ];
}

/** Execute a single SES provisioning step */
export async function executeSesStep(
  config: AwsClientConfig,
  step: ProvisioningStep,
  context: {
    organizationId: string;
    organizationSlug: string;
    domain?: string;
    previousResults: Record<string, unknown>;
  }
): Promise<{ result?: Record<string, unknown>; error?: string }> {
  switch (step.id) {
    case "ses.verify_domain": {
      const domain = context.domain;
      if (!domain) {
        return {
          error:
            "No domain provided for SES verification. Add a website URL to the client profile first.",
        };
      }

      const result = await sesClient.verifyDomain(config, { domain });

      await prisma.serviceConfig.updateMany({
        where: {
          organizationId: context.organizationId,
          serviceType: "ses",
        },
        data: {
          status: "configuring",
          configDetails: {
            domain,
            dkimStatus: result.dkimAttributes?.Status,
            dkimTokens: result.dkimAttributes?.Tokens,
            verifiedForSending: result.verifiedForSendingStatus,
          },
        },
      });

      return {
        result: {
          domain,
          dkimStatus: result.dkimAttributes?.Status,
          dkimTokens: result.dkimAttributes?.Tokens,
        },
      };
    }

    case "ses.create_config_set": {
      const configSetName = `sv-${context.organizationSlug}`
        .substring(0, 64)
        .replace(/[^a-zA-Z0-9-]/g, "-");

      await sesClient.createConfigurationSet(config, {
        name: configSetName,
      });

      return { result: { configurationSetName: configSetName } };
    }

    case "ses.check_account_status": {
      const status = await sesClient.getAccountStatus(config);
      return {
        result: {
          sendingEnabled: status.sendingEnabled,
          productionAccessEnabled: status.productionAccessEnabled,
          sendQuota: status.sendQuota,
        },
      };
    }

    default:
      return { error: `Unknown step: ${step.id}` };
  }
}
