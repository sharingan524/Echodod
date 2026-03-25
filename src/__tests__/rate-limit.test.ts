import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { checkRateLimit, getClientIp, applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    // Reset rate limit store between tests by calling with unique keys
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("checkRateLimit", () => {
    it("allows requests within the limit", () => {
      const key = `test-allow-${Date.now()}`;
      const config = { limit: 3, windowSeconds: 60 };

      const r1 = checkRateLimit(key, config);
      expect(r1.allowed).toBe(true);
      expect(r1.remaining).toBe(2);

      const r2 = checkRateLimit(key, config);
      expect(r2.allowed).toBe(true);
      expect(r2.remaining).toBe(1);

      const r3 = checkRateLimit(key, config);
      expect(r3.allowed).toBe(true);
      expect(r3.remaining).toBe(0);
    });

    it("blocks requests exceeding the limit", () => {
      const key = `test-block-${Date.now()}`;
      const config = { limit: 2, windowSeconds: 60 };

      checkRateLimit(key, config);
      checkRateLimit(key, config);

      const r3 = checkRateLimit(key, config);
      expect(r3.allowed).toBe(false);
      expect(r3.remaining).toBe(0);
    });

    it("resets after the window expires", () => {
      const key = `test-reset-${Date.now()}`;
      const config = { limit: 1, windowSeconds: 60 };

      const r1 = checkRateLimit(key, config);
      expect(r1.allowed).toBe(true);

      const r2 = checkRateLimit(key, config);
      expect(r2.allowed).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(61_000);

      const r3 = checkRateLimit(key, config);
      expect(r3.allowed).toBe(true);
    });

    it("returns correct resetAt timestamp", () => {
      const key = `test-resetAt-${Date.now()}`;
      const config = { limit: 5, windowSeconds: 120 };
      const now = Date.now();

      const result = checkRateLimit(key, config);
      expect(result.resetAt).toBeGreaterThanOrEqual(now + 120_000);
      expect(result.limit).toBe(5);
    });
  });

  describe("getClientIp", () => {
    it("extracts IP from x-forwarded-for header", () => {
      const request = new Request("http://localhost/api", {
        headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
      });
      expect(getClientIp(request)).toBe("1.2.3.4");
    });

    it("returns 'unknown' when no forwarded header", () => {
      const request = new Request("http://localhost/api");
      expect(getClientIp(request)).toBe("unknown");
    });
  });

  describe("applyRateLimit", () => {
    it("returns null when under limit", () => {
      const request = new Request("http://localhost/api", {
        headers: { "x-forwarded-for": `apply-test-${Date.now()}` },
      });
      const result = applyRateLimit(request, "test", { limit: 10, windowSeconds: 60 });
      expect(result).toBeNull();
    });

    it("returns 429 Response when over limit", () => {
      const ip = `over-limit-${Date.now()}`;
      const config = { limit: 1, windowSeconds: 60 };

      const req1 = new Request("http://localhost/api", {
        headers: { "x-forwarded-for": ip },
      });
      applyRateLimit(req1, "test429", config);

      const req2 = new Request("http://localhost/api", {
        headers: { "x-forwarded-for": ip },
      });
      const result = applyRateLimit(req2, "test429", config);

      expect(result).not.toBeNull();
      expect(result!.status).toBe(429);
    });
  });

  describe("RATE_LIMITS", () => {
    it("has auth, api, and webhook presets", () => {
      expect(RATE_LIMITS.auth.limit).toBe(5);
      expect(RATE_LIMITS.api.limit).toBe(60);
      expect(RATE_LIMITS.webhook.limit).toBe(100);
    });
  });
});
