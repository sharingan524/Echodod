import { describe, it, expect } from "vitest";
import { storeCredentialsSchema } from "@/lib/api/schemas/aws-credentials";

describe("storeCredentialsSchema", () => {
  const valid = {
    accessKeyId: "AKIAIOSFODNN7EXAMPLE",
    secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    region: "us-east-1" as const,
  };

  it("accepts valid credentials", () => {
    const result = storeCredentialsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("defaults region to us-east-1", () => {
    const result = storeCredentialsSchema.safeParse({
      accessKeyId: valid.accessKeyId,
      secretAccessKey: valid.secretAccessKey,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.region).toBe("us-east-1");
    }
  });

  it("rejects accessKeyId without AKIA prefix", () => {
    const result = storeCredentialsSchema.safeParse({
      ...valid,
      accessKeyId: "XYZAIOSFODNN7EXAMPLE",
    });
    expect(result.success).toBe(false);
  });

  it("rejects accessKeyId shorter than 16 chars", () => {
    const result = storeCredentialsSchema.safeParse({
      ...valid,
      accessKeyId: "AKIA12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects secretAccessKey shorter than 20 chars", () => {
    const result = storeCredentialsSchema.safeParse({
      ...valid,
      secretAccessKey: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid region", () => {
    const result = storeCredentialsSchema.safeParse({
      ...valid,
      region: "mars-west-1",
    });
    expect(result.success).toBe(false);
  });

  it("accepts all valid regions", () => {
    const regions = [
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
    ];
    for (const region of regions) {
      const result = storeCredentialsSchema.safeParse({ ...valid, region });
      expect(result.success).toBe(true);
    }
  });

  it("rejects missing accessKeyId", () => {
    const result = storeCredentialsSchema.safeParse({
      secretAccessKey: valid.secretAccessKey,
      region: valid.region,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing secretAccessKey", () => {
    const result = storeCredentialsSchema.safeParse({
      accessKeyId: valid.accessKeyId,
      region: valid.region,
    });
    expect(result.success).toBe(false);
  });
});
