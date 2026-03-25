/**
 * AWS Credential Management
 * Handles platform credentials (demo/shared) and per-client credentials.
 *
 * Environment Variables Required:
 * - AWS_PLATFORM_ACCESS_KEY_ID: Platform AWS access key
 * - AWS_PLATFORM_SECRET_ACCESS_KEY: Platform AWS secret key
 * - AWS_PLATFORM_REGION: Platform default region
 * - AWS_CREDENTIAL_ENCRYPTION_KEY: 32-byte hex key for credential encryption
 */

import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";
import { prisma } from "@/lib/db";
import { encrypt, decrypt } from "./encryption";
import { logger } from "@/lib/logger";

export interface AwsClientConfig {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

/** Platform credentials for demo mode and shared resources */
export function getPlatformConfig(regionOverride?: string): AwsClientConfig {
  const accessKeyId = process.env.AWS_PLATFORM_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_PLATFORM_SECRET_ACCESS_KEY;
  const region =
    regionOverride || process.env.AWS_PLATFORM_REGION || "us-east-1";

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("AWS platform credentials not configured");
  }

  return { region, credentials: { accessKeyId, secretAccessKey } };
}

/** Resolve AWS config for a specific organization */
export async function getClientConfig(
  organizationId: string
): Promise<AwsClientConfig> {
  const credential = await prisma.awsCredential.findUnique({
    where: { organizationId },
  });

  if (!credential) {
    throw new Error(
      `No AWS credentials found for organization ${organizationId}`
    );
  }

  if (!credential.isValid) {
    throw new Error(
      `AWS credentials for organization ${organizationId} have not been validated`
    );
  }

  return {
    region: credential.region,
    credentials: {
      accessKeyId: decrypt(credential.accessKeyId),
      secretAccessKey: decrypt(credential.secretAccessKey),
    },
  };
}

/** Validate AWS credentials via STS GetCallerIdentity */
export async function validateAwsCredentials(
  accessKeyId: string,
  secretAccessKey: string,
  region: string = "us-east-1"
): Promise<{
  valid: boolean;
  accountId?: string;
  arn?: string;
  error?: string;
}> {
  try {
    const sts = new STSClient({
      region,
      credentials: { accessKeyId, secretAccessKey },
    });

    const identity = await sts.send(new GetCallerIdentityCommand({}));

    return {
      valid: true,
      accountId: identity.Account,
      arn: identity.Arn,
    };
  } catch (err) {
    logger.error("AWS credential validation failed", {}, err);
    return {
      valid: false,
      error: err instanceof Error ? err.message : "Validation failed",
    };
  }
}

/** Store encrypted credentials for an organization */
export async function storeClientCredentials(params: {
  organizationId: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}): Promise<{ success: boolean; accountId?: string; error?: string }> {
  // First validate the credentials
  const validation = await validateAwsCredentials(
    params.accessKeyId,
    params.secretAccessKey,
    params.region
  );

  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Encrypt and store
  await prisma.awsCredential.upsert({
    where: { organizationId: params.organizationId },
    update: {
      accessKeyId: encrypt(params.accessKeyId),
      secretAccessKey: encrypt(params.secretAccessKey),
      region: params.region,
      accountId: validation.accountId || null,
      isValid: true,
      lastValidatedAt: new Date(),
    },
    create: {
      organizationId: params.organizationId,
      accessKeyId: encrypt(params.accessKeyId),
      secretAccessKey: encrypt(params.secretAccessKey),
      region: params.region,
      accountId: validation.accountId || null,
      isValid: true,
      lastValidatedAt: new Date(),
    },
  });

  return { success: true, accountId: validation.accountId };
}
