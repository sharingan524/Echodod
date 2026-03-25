import { describe, it, expect } from "vitest";
import { greetingEntrySchema, updateGreetingsSchema } from "@/lib/api/schemas/greeting";

describe("greetingEntrySchema", () => {
  const validEntry = {
    channel: "phone" as const,
    message: "Hello, welcome to our service!",
    isActive: true,
  };

  it("accepts a valid greeting entry", () => {
    const result = greetingEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it("accepts channel 'phone'", () => {
    const result = greetingEntrySchema.safeParse({ ...validEntry, channel: "phone" });
    expect(result.success).toBe(true);
  });

  it("accepts channel 'chat'", () => {
    const result = greetingEntrySchema.safeParse({ ...validEntry, channel: "chat" });
    expect(result.success).toBe(true);
  });

  it("accepts channel 'email'", () => {
    const result = greetingEntrySchema.safeParse({ ...validEntry, channel: "email" });
    expect(result.success).toBe(true);
  });

  it("accepts channel 'sms'", () => {
    const result = greetingEntrySchema.safeParse({ ...validEntry, channel: "sms" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid channel value", () => {
    const result = greetingEntrySchema.safeParse({ ...validEntry, channel: "fax" });
    expect(result.success).toBe(false);
  });

  it("rejects empty channel", () => {
    const result = greetingEntrySchema.safeParse({ ...validEntry, channel: "" });
    expect(result.success).toBe(false);
  });

  it("requires message field", () => {
    const result = greetingEntrySchema.safeParse({
      channel: "phone",
      isActive: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty message", () => {
    const result = greetingEntrySchema.safeParse({ ...validEntry, message: "" });
    expect(result.success).toBe(false);
  });

  it("rejects message exceeding 2000 characters", () => {
    const result = greetingEntrySchema.safeParse({
      ...validEntry,
      message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts message at exactly 2000 characters", () => {
    const result = greetingEntrySchema.safeParse({
      ...validEntry,
      message: "a".repeat(2000),
    });
    expect(result.success).toBe(true);
  });

  it("defaults isActive to true when not provided", () => {
    const result = greetingEntrySchema.safeParse({
      channel: "phone",
      message: "Hello!",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(true);
    }
  });

  it("accepts isActive as false", () => {
    const result = greetingEntrySchema.safeParse({ ...validEntry, isActive: false });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isActive).toBe(false);
    }
  });
});

describe("updateGreetingsSchema", () => {
  const makeGreeting = (channel: "phone" | "chat" | "email" | "sms") => ({
    channel,
    message: `Hello from ${channel}!`,
    isActive: true,
  });

  it("accepts valid greetings array with 1 entry", () => {
    const result = updateGreetingsSchema.safeParse({
      greetings: [makeGreeting("phone")],
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid greetings array with 4 entries", () => {
    const result = updateGreetingsSchema.safeParse({
      greetings: [
        makeGreeting("phone"),
        makeGreeting("chat"),
        makeGreeting("email"),
        makeGreeting("sms"),
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty greetings array", () => {
    const result = updateGreetingsSchema.safeParse({ greetings: [] });
    expect(result.success).toBe(false);
  });

  it("rejects more than 4 greetings", () => {
    const result = updateGreetingsSchema.safeParse({
      greetings: [
        makeGreeting("phone"),
        makeGreeting("chat"),
        makeGreeting("email"),
        makeGreeting("sms"),
        makeGreeting("phone"),
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing greetings field", () => {
    const result = updateGreetingsSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
