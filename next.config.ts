import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
    // Marketing pages - CDN + browser cache
    {
      source: "/(pricing|how-it-works|contact|technology|solutions|solutions/:path*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        },
      ],
    },
    // Legal pages - long cache (rarely change)
    {
      source: "/(privacy|terms)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
        },
      ],
    },
    // Health endpoint - short cache for monitoring
    {
      source: "/api/health",
      headers: [{ key: "Cache-Control", value: "public, max-age=30" }],
    },
    // TTS audio - already has inline cache, reinforce at CDN
    {
      source: "/api/voice/tts",
      headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
    },
    // Content pages - same cache as marketing
    {
      source: "/(blog|blog/:path*|compare/:path*|case-studies|case-studies/:path*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        },
      ],
    },
  ],
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: { deleteSourcemapsAfterUpload: true },
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
