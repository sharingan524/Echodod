import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("aws/encryption", () => {
  const TEST_KEY = "a".repeat(64); // 32 bytes of 0xaa

  beforeEach(() => {
    vi.stubEnv("AWS_CREDENTIAL_ENCRYPTION_KEY", TEST_KEY);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("encrypts and decrypts a string round-trip", async () => {
    const { encrypt, decrypt } = await import("@/lib/aws/encryption");
    const plaintext = "my-secret-access-key-12345";
    const encrypted = encrypt(plaintext);
    expect(encrypted).not.toBe(plaintext);
    expect(decrypt(encrypted)).toBe(plaintext);
  });

  it("produces different ciphertext for the same input (random IV)", async () => {
    const { encrypt } = await import("@/lib/aws/encryption");
    const plaintext = "same-input";
    const a = encrypt(plaintext);
    const b = encrypt(plaintext);
    expect(a).not.toBe(b);
  });

  it("encrypted output is base64 encoded", async () => {
    const { encrypt } = await import("@/lib/aws/encryption");
    const encrypted = encrypt("test");
    expect(() => Buffer.from(encrypted, "base64")).not.toThrow();
    // Re-encoding should match (valid base64)
    expect(Buffer.from(encrypted, "base64").toString("base64")).toBe(encrypted);
  });

  it("decryption fails with tampered ciphertext", async () => {
    const { encrypt, decrypt } = await import("@/lib/aws/encryption");
    const encrypted = encrypt("secret");
    const buf = Buffer.from(encrypted, "base64");
    // Flip a byte in the ciphertext portion
    buf[buf.length - 1] ^= 0xff;
    const tampered = buf.toString("base64");
    expect(() => decrypt(tampered)).toThrow();
  });

  it("throws if encryption key is missing", async () => {
    vi.stubEnv("AWS_CREDENTIAL_ENCRYPTION_KEY", "");
    // Re-import to pick up the new env
    const mod = await import("@/lib/aws/encryption");
    expect(() => mod.encrypt("test")).toThrow(
      "AWS_CREDENTIAL_ENCRYPTION_KEY must be a 64-character hex string"
    );
  });

  it("throws if encryption key is wrong length", async () => {
    vi.stubEnv("AWS_CREDENTIAL_ENCRYPTION_KEY", "abcd1234");
    const mod = await import("@/lib/aws/encryption");
    expect(() => mod.encrypt("test")).toThrow(
      "AWS_CREDENTIAL_ENCRYPTION_KEY must be a 64-character hex string"
    );
  });

  it("handles empty string encryption", async () => {
    const { encrypt, decrypt } = await import("@/lib/aws/encryption");
    const encrypted = encrypt("");
    expect(decrypt(encrypted)).toBe("");
  });

  it("handles unicode content", async () => {
    const { encrypt, decrypt } = await import("@/lib/aws/encryption");
    const unicode = "Hello 🌍 — café résumé";
    expect(decrypt(encrypt(unicode))).toBe(unicode);
  });
});
