import { describe, it, expect } from "vitest";
import { logFilterSchema } from "@/lib/api/schemas/communication-log";

describe("logFilterSchema", () => {
  it("accepts valid filters with all fields", () => {
    const result = logFilterSchema.safeParse({
      channel: "phone",
      status: "completed",
      outcome: "resolved",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      search: "customer inquiry",
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty object (all fields optional)", () => {
    const result = logFilterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts channel 'phone'", () => {
    const result = logFilterSchema.safeParse({ channel: "phone" });
    expect(result.success).toBe(true);
  });

  it("accepts channel 'chat'", () => {
    const result = logFilterSchema.safeParse({ channel: "chat" });
    expect(result.success).toBe(true);
  });

  it("accepts channel 'sms'", () => {
    const result = logFilterSchema.safeParse({ channel: "sms" });
    expect(result.success).toBe(true);
  });

  it("accepts channel 'email'", () => {
    const result = logFilterSchema.safeParse({ channel: "email" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid channel value", () => {
    const result = logFilterSchema.safeParse({ channel: "fax" });
    expect(result.success).toBe(false);
  });

  it("accepts status 'completed'", () => {
    const result = logFilterSchema.safeParse({ status: "completed" });
    expect(result.success).toBe(true);
  });

  it("accepts status 'failed'", () => {
    const result = logFilterSchema.safeParse({ status: "failed" });
    expect(result.success).toBe(true);
  });

  it("accepts status 'in-progress'", () => {
    const result = logFilterSchema.safeParse({ status: "in-progress" });
    expect(result.success).toBe(true);
  });

  it("accepts status 'sent'", () => {
    const result = logFilterSchema.safeParse({ status: "sent" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status value", () => {
    const result = logFilterSchema.safeParse({ status: "pending" });
    expect(result.success).toBe(false);
  });

  it("accepts outcome 'resolved'", () => {
    const result = logFilterSchema.safeParse({ outcome: "resolved" });
    expect(result.success).toBe(true);
  });

  it("accepts outcome 'escalated'", () => {
    const result = logFilterSchema.safeParse({ outcome: "escalated" });
    expect(result.success).toBe(true);
  });

  it("accepts outcome 'missed'", () => {
    const result = logFilterSchema.safeParse({ outcome: "missed" });
    expect(result.success).toBe(true);
  });

  it("accepts outcome 'delivered'", () => {
    const result = logFilterSchema.safeParse({ outcome: "delivered" });
    expect(result.success).toBe(true);
  });

  it("accepts outcome 'bounced'", () => {
    const result = logFilterSchema.safeParse({ outcome: "bounced" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid outcome value", () => {
    const result = logFilterSchema.safeParse({ outcome: "unknown" });
    expect(result.success).toBe(false);
  });

  it("coerces date strings into Date objects", () => {
    const result = logFilterSchema.safeParse({
      startDate: "2025-01-01",
      endDate: "2025-12-31",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.startDate).toBeInstanceOf(Date);
      expect(result.data.endDate).toBeInstanceOf(Date);
    }
  });

  it("rejects invalid date strings", () => {
    const result = logFilterSchema.safeParse({ startDate: "not-a-date" });
    expect(result.success).toBe(false);
  });

  it("accepts a search string", () => {
    const result = logFilterSchema.safeParse({ search: "test search" });
    expect(result.success).toBe(true);
  });

  it("accepts partial filters", () => {
    const result = logFilterSchema.safeParse({
      channel: "email",
      status: "sent",
    });
    expect(result.success).toBe(true);
  });
});
