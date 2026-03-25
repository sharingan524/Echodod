/**
 * AWS SES V2 Client
 * Manages email identity verification, configuration sets, and sending.
 */

import {
  SESv2Client,
  CreateEmailIdentityCommand,
  GetEmailIdentityCommand,
  CreateConfigurationSetCommand,
  SendEmailCommand,
  GetAccountCommand,
  type DkimSigningKeyLength,
} from "@aws-sdk/client-sesv2";
import { logger } from "@/lib/logger";
import type { AwsClientConfig } from "./credentials";

function createClient(config: AwsClientConfig): SESv2Client {
  return new SESv2Client({
    region: config.region,
    credentials: config.credentials,
  });
}

/** Create and verify a domain identity (triggers DKIM setup) */
export async function verifyDomain(
  config: AwsClientConfig,
  params: {
    domain: string;
    dkimKeyLength?: DkimSigningKeyLength;
  }
) {
  const client = createClient(config);
  const command = new CreateEmailIdentityCommand({
    EmailIdentity: params.domain,
    DkimSigningAttributes: {
      NextSigningKeyLength: params.dkimKeyLength || "RSA_2048_BIT",
    },
  });

  const result = await client.send(command);
  logger.info("SES domain identity created", {
    domain: params.domain,
    dkimStatus: result.DkimAttributes?.Status,
  });

  return {
    identityType: result.IdentityType,
    verifiedForSendingStatus: result.VerifiedForSendingStatus,
    dkimAttributes: result.DkimAttributes,
  };
}

/** Check domain verification status */
export async function getDomainStatus(
  config: AwsClientConfig,
  domain: string
) {
  const client = createClient(config);
  const command = new GetEmailIdentityCommand({ EmailIdentity: domain });
  const result = await client.send(command);

  return {
    verifiedForSending: result.VerifiedForSendingStatus,
    dkimStatus: result.DkimAttributes?.Status,
    dkimTokens: result.DkimAttributes?.Tokens,
    identityType: result.IdentityType,
  };
}

/** Create a configuration set for tracking */
export async function createConfigurationSet(
  config: AwsClientConfig,
  params: {
    name: string;
    customRedirectDomain?: string;
  }
) {
  const client = createClient(config);
  const command = new CreateConfigurationSetCommand({
    ConfigurationSetName: params.name,
    TrackingOptions: params.customRedirectDomain
      ? { CustomRedirectDomain: params.customRedirectDomain }
      : undefined,
    SendingOptions: { SendingEnabled: true },
    ReputationOptions: { ReputationMetricsEnabled: true },
  });

  await client.send(command);
  logger.info("SES configuration set created", { name: params.name });
  return { configurationSetName: params.name };
}

/** Send an email via SES */
export async function sendEmail(
  config: AwsClientConfig,
  params: {
    from: string;
    to: string[];
    subject: string;
    htmlBody: string;
    textBody?: string;
    configurationSetName?: string;
  }
) {
  const client = createClient(config);
  const command = new SendEmailCommand({
    FromEmailAddress: params.from,
    Destination: { ToAddresses: params.to },
    Content: {
      Simple: {
        Subject: { Data: params.subject },
        Body: {
          Html: { Data: params.htmlBody },
          Text: params.textBody ? { Data: params.textBody } : undefined,
        },
      },
    },
    ConfigurationSetName: params.configurationSetName,
  });

  const result = await client.send(command);
  logger.info("SES email sent", { messageId: result.MessageId });
  return { messageId: result.MessageId };
}

/** Get SES account status and sending limits */
export async function getAccountStatus(config: AwsClientConfig) {
  const client = createClient(config);
  const command = new GetAccountCommand({});
  const result = await client.send(command);

  return {
    sendingEnabled: result.SendingEnabled,
    productionAccessEnabled: result.ProductionAccessEnabled,
    sendQuota: result.SendQuota,
    enforcementStatus: result.EnforcementStatus,
  };
}
