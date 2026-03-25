/**
 * AWS Pinpoint SMS/Voice V2 Client
 * Manages SMS messaging, phone number pools, and delivery statistics.
 */

import {
  PinpointSMSVoiceV2Client,
  CreatePoolCommand,
  SendTextMessageCommand,
  DescribeAccountLimitsCommand,
  RequestPhoneNumberCommand,
  DescribePhoneNumbersCommand,
  type MessageType,
} from "@aws-sdk/client-pinpoint-sms-voice-v2";
import { logger } from "@/lib/logger";
import type { AwsClientConfig } from "./credentials";

function createClient(
  config: AwsClientConfig
): PinpointSMSVoiceV2Client {
  return new PinpointSMSVoiceV2Client({
    region: config.region,
    credentials: config.credentials,
  });
}

/** Request a phone number and create a pool for SMS */
export async function createPool(
  config: AwsClientConfig,
  params: {
    isoCountryCode: string;
    messageType: MessageType;
  }
) {
  const client = createClient(config);

  // First request a phone number
  const phoneResult = await client.send(
    new RequestPhoneNumberCommand({
      IsoCountryCode: params.isoCountryCode,
      MessageType: params.messageType,
      NumberCapabilities: ["SMS"],
      NumberType: "LONG_CODE",
    })
  );

  logger.info("Pinpoint phone number requested", {
    phoneNumberId: phoneResult.PhoneNumberId,
  });

  // Create a pool with the phone number
  const poolResult = await client.send(
    new CreatePoolCommand({
      OriginationIdentity: phoneResult.PhoneNumberArn!,
      IsoCountryCode: params.isoCountryCode,
      MessageType: params.messageType,
    })
  );

  logger.info("Pinpoint pool created", { poolId: poolResult.PoolId });

  return {
    phoneNumberId: phoneResult.PhoneNumberId,
    phoneNumber: phoneResult.PhoneNumber,
    poolId: poolResult.PoolId,
    poolArn: poolResult.PoolArn,
  };
}

/** Send an SMS message */
export async function sendSms(
  config: AwsClientConfig,
  params: {
    destinationPhoneNumber: string;
    messageBody: string;
    originationIdentity?: string;
    messageType?: MessageType;
  }
) {
  const client = createClient(config);
  const command = new SendTextMessageCommand({
    DestinationPhoneNumber: params.destinationPhoneNumber,
    MessageBody: params.messageBody,
    OriginationIdentity: params.originationIdentity,
    MessageType: params.messageType || "TRANSACTIONAL",
  });

  const result = await client.send(command);
  logger.info("SMS sent", { messageId: result.MessageId });
  return { messageId: result.MessageId };
}

/** Get account limits and usage */
export async function getAccountLimits(config: AwsClientConfig) {
  const client = createClient(config);
  const command = new DescribeAccountLimitsCommand({});
  const result = await client.send(command);
  return result.AccountLimits || [];
}

/** List phone numbers in the account */
export async function describePhoneNumbers(config: AwsClientConfig) {
  const client = createClient(config);
  const command = new DescribePhoneNumbersCommand({});
  const result = await client.send(command);
  return result.PhoneNumbers || [];
}
