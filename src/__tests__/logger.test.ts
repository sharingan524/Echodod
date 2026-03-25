import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "@/lib/logger";

describe("logger", () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, "log").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs info messages", () => {
    logger.info("test message");
    expect(consoleSpy.log).toHaveBeenCalledOnce();
    const output = consoleSpy.log.mock.calls[0][0] as string;
    expect(output).toContain("[INFO]");
    expect(output).toContain("test message");
  });

  it("logs error messages with console.error", () => {
    logger.error("error message");
    expect(consoleSpy.error).toHaveBeenCalledOnce();
    const output = consoleSpy.error.mock.calls[0][0] as string;
    expect(output).toContain("[ERROR]");
    expect(output).toContain("error message");
  });

  it("logs warn messages with console.warn", () => {
    logger.warn("warn message");
    expect(consoleSpy.warn).toHaveBeenCalledOnce();
    const output = consoleSpy.warn.mock.calls[0][0] as string;
    expect(output).toContain("[WARN]");
    expect(output).toContain("warn message");
  });

  it("includes context in log output", () => {
    logger.info("with context", { userId: "123", action: "login" });
    const output = consoleSpy.log.mock.calls[0][0] as string;
    expect(output).toContain("userId");
    expect(output).toContain("123");
  });

  it("includes error details in error logs", () => {
    const err = new Error("something broke");
    logger.error("failure", {}, err);
    const output = consoleSpy.error.mock.calls[0][0] as string;
    expect(output).toContain("something broke");
  });

  it("logs debug messages in development", () => {
    logger.debug("debug info");
    expect(consoleSpy.log).toHaveBeenCalledOnce();
    const output = consoleSpy.log.mock.calls[0][0] as string;
    expect(output).toContain("[DEBUG]");
  });
});
