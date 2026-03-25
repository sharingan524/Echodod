import { describe, it, expect } from "vitest";
import {
  businessHoursEntrySchema,
  updateBusinessHoursSchema,
} from "@/lib/api/schemas/business-hours";

describe("businessHoursEntrySchema", () => {
  const validEntry = {
    dayOfWeek: 0,
    openTime: "09:00",
    closeTime: "17:00",
    isClosed: false,
  };

  it("accepts a valid business hours entry", () => {
    const result = businessHoursEntrySchema.safeParse(validEntry);
    expect(result.success).toBe(true);
  });

  it("accepts dayOfWeek 0 (Sunday)", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, dayOfWeek: 0 });
    expect(result.success).toBe(true);
  });

  it("accepts dayOfWeek 6 (Saturday)", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, dayOfWeek: 6 });
    expect(result.success).toBe(true);
  });

  it("rejects dayOfWeek less than 0", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, dayOfWeek: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects dayOfWeek greater than 6", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, dayOfWeek: 7 });
    expect(result.success).toBe(false);
  });

  it("rejects non-integer dayOfWeek", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, dayOfWeek: 2.5 });
    expect(result.success).toBe(false);
  });

  it("accepts valid time format 00:00", () => {
    const result = businessHoursEntrySchema.safeParse({
      ...validEntry,
      openTime: "00:00",
      closeTime: "23:59",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid time format (single digit hour)", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, openTime: "9:00" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid time format (hour > 23)", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, openTime: "24:00" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid time format (minute > 59)", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, closeTime: "12:60" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid time format (no colon)", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, openTime: "0900" });
    expect(result.success).toBe(false);
  });

  it("rejects non-boolean isClosed", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, isClosed: "yes" });
    expect(result.success).toBe(false);
  });

  it("accepts isClosed true", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, isClosed: true });
    expect(result.success).toBe(true);
  });

  it("accepts isClosed false", () => {
    const result = businessHoursEntrySchema.safeParse({ ...validEntry, isClosed: false });
    expect(result.success).toBe(true);
  });
});

describe("updateBusinessHoursSchema", () => {
  const makeWeek = () =>
    Array.from({ length: 7 }, (_, i) => ({
      dayOfWeek: i,
      openTime: "09:00",
      closeTime: "17:00",
      isClosed: i === 0 || i === 6,
    }));

  it("accepts a valid array of 7 entries", () => {
    const result = updateBusinessHoursSchema.safeParse({ hours: makeWeek() });
    expect(result.success).toBe(true);
  });

  it("rejects fewer than 7 entries", () => {
    const result = updateBusinessHoursSchema.safeParse({
      hours: makeWeek().slice(0, 6),
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 7 entries", () => {
    const week = makeWeek();
    week.push({ dayOfWeek: 0, openTime: "09:00", closeTime: "17:00", isClosed: false });
    const result = updateBusinessHoursSchema.safeParse({ hours: week });
    expect(result.success).toBe(false);
  });

  it("rejects missing hours field", () => {
    const result = updateBusinessHoursSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
