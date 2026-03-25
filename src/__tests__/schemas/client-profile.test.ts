import { describe, it, expect } from "vitest";
import { updateClientProfileSchema } from "@/lib/api/schemas/client-profile";

describe("updateClientProfileSchema", () => {
  it("accepts valid data with all optional fields", () => {
    const data = {
      businessName: "Acme Corp",
      address: "123 Main St",
      phone: "+1-555-0100",
      email: "info@acme.com",
      website: "https://acme.com",
      description: "A great company",
      industry: "Technology",
      timezone: "America/New_York",
    };
    const result = updateClientProfileSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (all fields optional)", () => {
    const result = updateClientProfileSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial data", () => {
    const result = updateClientProfileSchema.safeParse({
      businessName: "Acme Corp",
      email: "info@acme.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email format", () => {
    const result = updateClientProfileSchema.safeParse({
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid email", () => {
    const result = updateClientProfileSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid website URL", () => {
    const result = updateClientProfileSchema.safeParse({
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an empty string for website", () => {
    const result = updateClientProfileSchema.safeParse({
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid URL for website", () => {
    const result = updateClientProfileSchema.safeParse({
      website: "https://example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects businessName exceeding 200 characters", () => {
    const result = updateClientProfileSchema.safeParse({
      businessName: "a".repeat(201),
    });
    expect(result.success).toBe(false);
  });

  it("accepts businessName at exactly 200 characters", () => {
    const result = updateClientProfileSchema.safeParse({
      businessName: "a".repeat(200),
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty businessName (min 1)", () => {
    const result = updateClientProfileSchema.safeParse({
      businessName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects address exceeding 500 characters", () => {
    const result = updateClientProfileSchema.safeParse({
      address: "a".repeat(501),
    });
    expect(result.success).toBe(false);
  });

  it("rejects phone exceeding 20 characters", () => {
    const result = updateClientProfileSchema.safeParse({
      phone: "1".repeat(21),
    });
    expect(result.success).toBe(false);
  });

  it("rejects description exceeding 2000 characters", () => {
    const result = updateClientProfileSchema.safeParse({
      description: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("rejects industry exceeding 100 characters", () => {
    const result = updateClientProfileSchema.safeParse({
      industry: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("rejects timezone exceeding 50 characters", () => {
    const result = updateClientProfileSchema.safeParse({
      timezone: "a".repeat(51),
    });
    expect(result.success).toBe(false);
  });
});
