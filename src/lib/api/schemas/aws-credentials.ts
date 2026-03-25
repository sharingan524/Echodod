/**
 * Validation schemas for AWS credential endpoints
 */

import { z } from "zod";

export const storeCredentialsSchema = z.object({
  accessKeyId: z
    .string()
    .min(16, "Access key ID must be at least 16 characters")
    .max(128)
    .regex(/^AKIA/, "Must be a valid AWS access key ID (starts with AKIA)"),
  secretAccessKey: z
    .string()
    .min(20, "Secret access key must be at least 20 characters")
    .max(128),
  region: z
    .enum([
      "us-east-1",
      "us-east-2",
      "us-west-1",
      "us-west-2",
      "eu-west-1",
      "eu-west-2",
      "eu-central-1",
      "ap-southeast-1",
      "ap-southeast-2",
      "ap-northeast-1",
      "ap-northeast-2",
    ])
    .default("us-east-1"),
});

export type StoreCredentialsInput = z.infer<typeof storeCredentialsSchema>;
