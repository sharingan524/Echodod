import { describe, it, expect } from "vitest";
import { createHolidaySchema } from "@/lib/api/schemas/holiday";

describe("createHolidaySchema", () => {
  it("accepts valid holiday data", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-25",
      name: "Christmas Day",
      isClosed: true,
    });
    expect(result.success).toBe(true);
  });

  it("accepts a Date object for date", () => {
    const result = createHolidaySchema.safeParse({
      date: new Date("2025-12-25"),
      name: "Christmas Day",
    });
    expect(result.success).toBe(true);
  });

  it("coerces a date string into a Date", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-07-04",
      name: "Independence Day",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.date).toBeInstanceOf(Date);
    }
  });

  it("rejects an invalid date string", () => {
    const result = createHolidaySchema.safeParse({
      date: "not-a-date",
      name: "Invalid",
    });
    expect(result.success).toBe(false);
  });

  it("requires the name field", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-25",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-25",
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding 100 characters", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-25",
      name: "a".repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it("accepts name at exactly 100 characters", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-25",
      name: "a".repeat(100),
    });
    expect(result.success).toBe(true);
  });

  it("defaults isClosed to true when not provided", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-25",
      name: "Christmas Day",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isClosed).toBe(true);
    }
  });

  it("accepts isClosed as false", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-25",
      name: "Christmas Eve",
      isClosed: false,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isClosed).toBe(false);
    }
  });

  it("accepts valid specialOpenTime in HH:MM format", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-24",
      name: "Christmas Eve",
      isClosed: false,
      specialOpenTime: "10:00",
      specialCloseTime: "14:00",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid specialOpenTime format", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-24",
      name: "Christmas Eve",
      isClosed: false,
      specialOpenTime: "9:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid specialCloseTime format", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-24",
      name: "Christmas Eve",
      isClosed: false,
      specialCloseTime: "25:00",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null for specialOpenTime and specialCloseTime", () => {
    const result = createHolidaySchema.safeParse({
      date: "2025-12-25",
      name: "Christmas Day",
      specialOpenTime: null,
      specialCloseTime: null,
    });
    expect(result.success).toBe(true);
  });
});
