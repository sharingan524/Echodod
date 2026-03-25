/**
 * Cryptographic utilities for API key generation
 */

import { randomBytes, createHash } from "crypto";

/**
 * Generates a new API key with hash and prefix
 * @returns Object containing the full key, its hash, and display prefix
 */
export function generateApiKey(): {
  key: string;
  hash: string;
  prefix: string;
} {
  const key = `sk_live_${randomBytes(32).toString("hex")}`;
  const hash = createHash("sha256").update(key).digest("hex");
  const prefix = key.substring(0, 12); // For display (sk_live_xxxxx)

  return { key, hash, prefix };
}

/**
 * Hashes an API key for storage
 * @param key - The API key to hash
 * @returns SHA-256 hash of the key
 */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key).digest("hex");
}

/**
 * Generates a webhook secret for HMAC verification
 * @returns Random webhook secret
 */
export function generateWebhookSecret(): string {
  return `whsec_${randomBytes(24).toString("hex")}`;
}
