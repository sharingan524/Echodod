/**
 * In-memory rate limiter for API routes.
 *
 * Uses a sliding window counter stored in a Map. The Map is cleaned up
 * periodically to prevent unbounded growth. For multi-instance deployments,
 * switch to Redis-backed rate limiting (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 60 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    }
  }, 60_000);
}

interface RateLimitConfig {
  /** Maximum number of requests in the window. */
  limit: number;
  /** Window size in seconds. */
  windowSeconds: number;
}

export const RATE_LIMITS = {
  /** Auth endpoints: 5 requests per minute */
  auth: { limit: 5, windowSeconds: 60 } satisfies RateLimitConfig,
  /** General API endpoints: 60 requests per minute */
  api: { limit: 60, windowSeconds: 60 } satisfies RateLimitConfig,
  /** Webhook receivers: 100 requests per minute */
  webhook: { limit: 100, windowSeconds: 60 } satisfies RateLimitConfig,
} as const;

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Check if a request is within rate limits.
 *
 * @param key - Unique identifier for the rate limit bucket (e.g. IP + route).
 * @param config - Rate limit configuration.
 * @returns Whether the request is allowed and remaining quota info.
 */
export function checkRateLimit(key: string, config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + config.windowSeconds * 1000;
    store.set(key, { count: 1, resetAt });
    return { allowed: true, limit: config.limit, remaining: config.limit - 1, resetAt };
  }

  entry.count += 1;

  if (entry.count > config.limit) {
    return { allowed: false, limit: config.limit, remaining: 0, resetAt: entry.resetAt };
  }

  return {
    allowed: true,
    limit: config.limit,
    remaining: config.limit - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Extract a client identifier from a request for rate limiting.
 * Uses x-forwarded-for (common with Vercel/proxies) or falls back to a default.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

/**
 * Apply rate limiting to a request. Returns a 429 Response if the limit
 * is exceeded, or null if the request is allowed.
 */
export function applyRateLimit(
  request: Request,
  prefix: string,
  config: RateLimitConfig
): Response | null {
  const ip = getClientIp(request);
  const key = `${prefix}:${ip}`;
  const result = checkRateLimit(key, config);

  if (!result.allowed) {
    return Response.json(
      {
        error: {
          message: "Too many requests. Please try again later.",
          code: "RATE_LIMITED",
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(result.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}
