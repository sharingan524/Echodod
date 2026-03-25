/**
 * AWS Connect Client
 * Manages Amazon Connect instances, queues, contact flows, and phone numbers.
 *
 * Each function takes an AwsClientConfig so it works with either
 * platform credentials or per-client credentials.
 */

import {
  ConnectClient,
  CreateInstanceCommand,
  DescribeInstanceCommand,
  CreateQueueCommand,
  CreateContactFlowCommand,
  ListPhoneNumbersV2Command,
  ClaimPhoneNumberCommand,
  ReleasePhoneNumberCommand,
  SearchAvailablePhoneNumbersCommand,
  GetCurrentMetricDataCommand,
  ListHoursOfOperationsCommand,
  type PhoneNumberCountryCode,
  type PhoneNumberType,
} from "@aws-sdk/client-connect";
import { logger } from "@/lib/logger";
import type { AwsClientConfig } from "./credentials";

function createClient(config: AwsClientConfig): ConnectClient {
  return new ConnectClient({
    region: config.region,
    credentials: config.credentials,
  });
}

/** Create a new Connect instance */
export async function createInstance(
  config: AwsClientConfig,
  params: {
    instanceAlias: string;
    identityManagementType?: string;
    inboundCallsEnabled?: boolean;
    outboundCallsEnabled?: boolean;
  }
) {
  const client = createClient(config);
  const command = new CreateInstanceCommand({
    InstanceAlias: params.instanceAlias,
    IdentityManagementType:
      (params.identityManagementType as "CONNECT_MANAGED") ||
      "CONNECT_MANAGED",
    InboundCallsEnabled: params.inboundCallsEnabled ?? true,
    OutboundCallsEnabled: params.outboundCallsEnabled ?? true,
  });

  const result = await client.send(command);
  logger.info("Connect instance created", { instanceId: result.Id });
  return { instanceId: result.Id, arn: result.Arn };
}

/** Check instance creation status */
export async function describeInstance(
  config: AwsClientConfig,
  instanceId: string
) {
  const client = createClient(config);
  const command = new DescribeInstanceCommand({ InstanceId: instanceId });
  const result = await client.send(command);
  return result.Instance;
}

/** List hours of operation for an instance (needed to create queues) */
export async function listHoursOfOperations(
  config: AwsClientConfig,
  instanceId: string
) {
  const client = createClient(config);
  const command = new ListHoursOfOperationsCommand({
    InstanceId: instanceId,
    MaxResults: 10,
  });
  const result = await client.send(command);
  return result.HoursOfOperationSummaryList || [];
}

/** Create a queue in a Connect instance */
export async function createQueue(
  config: AwsClientConfig,
  params: {
    instanceId: string;
    name: string;
    description?: string;
    hoursOfOperationId: string;
  }
) {
  const client = createClient(config);
  const command = new CreateQueueCommand({
    InstanceId: params.instanceId,
    Name: params.name,
    Description: params.description,
    HoursOfOperationId: params.hoursOfOperationId,
  });

  const result = await client.send(command);
  logger.info("Connect queue created", { queueId: result.QueueId });
  return { queueId: result.QueueId, queueArn: result.QueueArn };
}

/** Create a contact flow */
export async function createContactFlow(
  config: AwsClientConfig,
  params: {
    instanceId: string;
    name: string;
    type: string;
    content: string;
    description?: string;
  }
) {
  const client = createClient(config);
  const command = new CreateContactFlowCommand({
    InstanceId: params.instanceId,
    Name: params.name,
    Type: params.type as "CONTACT_FLOW",
    Content: params.content,
    Description: params.description,
  });

  const result = await client.send(command);
  logger.info("Contact flow created", {
    contactFlowId: result.ContactFlowId,
  });
  return {
    contactFlowId: result.ContactFlowId,
    contactFlowArn: result.ContactFlowArn,
  };
}

/** Search for available phone numbers to claim */
export async function searchAvailablePhoneNumbers(
  config: AwsClientConfig,
  params: {
    targetArn: string;
    countryCode: PhoneNumberCountryCode | string;
    type: PhoneNumberType | string;
    maxResults?: number;
  }
) {
  const client = createClient(config);
  const command = new SearchAvailablePhoneNumbersCommand({
    TargetArn: params.targetArn,
    PhoneNumberCountryCode: params.countryCode as PhoneNumberCountryCode,
    PhoneNumberType: params.type as PhoneNumberType,
    MaxResults: params.maxResults || 10,
  });

  const result = await client.send(command);
  return result.AvailableNumbersList || [];
}

/** Claim a phone number for a Connect instance */
export async function claimPhoneNumber(
  config: AwsClientConfig,
  params: {
    targetArn: string;
    phoneNumber: string;
    description?: string;
  }
) {
  const client = createClient(config);
  const command = new ClaimPhoneNumberCommand({
    TargetArn: params.targetArn,
    PhoneNumber: params.phoneNumber,
    PhoneNumberDescription: params.description,
  });

  const result = await client.send(command);
  logger.info("Phone number claimed", {
    phoneNumberId: result.PhoneNumberId,
  });
  return {
    phoneNumberId: result.PhoneNumberId,
    phoneNumberArn: result.PhoneNumberArn,
  };
}

/** Release a phone number */
export async function releasePhoneNumber(
  config: AwsClientConfig,
  phoneNumberId: string
) {
  const client = createClient(config);
  const command = new ReleasePhoneNumberCommand({
    PhoneNumberId: phoneNumberId,
  });
  await client.send(command);
  logger.info("Phone number released", { phoneNumberId });
}

/** List phone numbers associated with an instance */
export async function listPhoneNumbers(
  config: AwsClientConfig,
  params: { targetArn: string; maxResults?: number }
) {
  const client = createClient(config);
  const command = new ListPhoneNumbersV2Command({
    TargetArn: params.targetArn,
    MaxResults: params.maxResults || 100,
  });

  const result = await client.send(command);
  return result.ListPhoneNumbersSummaryList || [];
}

/** Get real-time metrics from Connect */
export async function getCurrentMetrics(
  config: AwsClientConfig,
  params: {
    instanceId: string;
    queueIds: string[];
  }
) {
  const client = createClient(config);
  const command = new GetCurrentMetricDataCommand({
    InstanceId: params.instanceId,
    Filters: {
      Queues: params.queueIds,
      Channels: ["VOICE"],
    },
    CurrentMetrics: [
      { Name: "AGENTS_ONLINE", Unit: "COUNT" },
      { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
      { Name: "CONTACTS_SCHEDULED", Unit: "COUNT" },
    ],
  });

  const result = await client.send(command);
  return result.MetricResults || [];
}
