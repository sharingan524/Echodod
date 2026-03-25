# Coding Standards

This repo follows common industry standards for modern TypeScript + Next.js projects.

## Goals

- Consistent code style (automated formatting)
- Correctness and maintainability (lint + types)
- Predictable API behavior (standard response envelope + errors)
- Security hygiene (no secrets in git/logs)

## Tooling (Source of Truth)

- Formatting: Prettier (run via `pnpm format`)
- Linting: ESLint (run via `pnpm lint`)
- Types: TypeScript `tsc --noEmit` (run via `pnpm typecheck`)

Prettier is enforced via git hooks and CI.

ESLint and typecheck are run in CI in an **informational** mode until existing
violations are cleaned up.

## TypeScript

- Prefer `type` for simple shapes and unions; use `interface` when extending public object contracts.
- Avoid `any`. If you must use it at the boundary (e.g., third-party payload), immediately validate/parse to a typed shape.
- Use `unknown` for untrusted data and narrow via Zod/type guards.
- Keep functions small and side-effect free when possible.

## React + Next.js (App Router)

- Keep server/client boundaries explicit: only add `"use client"` when necessary.
- Prefer server components for data fetching and static rendering.
- Keep client components focused on interactivity.
- Avoid doing heavy work in React render; move it to helpers.

## Naming and Structure

- Use `camelCase` for variables/functions, `PascalCase` for components/classes, `SCREAMING_SNAKE_CASE` for constants.
- Use clear names that reflect intent (avoid abbreviations unless widely understood).
- Keep reusable UI in `src/components/ui` and domain-specific UI in `src/components/<domain>`.
- Keep shared backend utilities in `src/lib`.

## API Routes

### Response Envelope

All **JSON** handlers under `src/app/api/**` must return a consistent JSON envelope.

Exceptions (must follow vendor requirements, not the JSON envelope):

- Twilio voice webhooks (TwiML / `text/xml`)
- Stripe webhooks (signature verification often requires raw body)
- NextAuth handler routes

**Success**

```json
{
  "data": {},
  "meta": {
    "timestamp": "2026-02-06T00:00:00.000Z",
    "requestId": "..."
  }
}
```

**Error**

```json
{
  "error": {
    "message": "...",
    "code": "...",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-02-06T00:00:00.000Z",
    "requestId": "..."
  }
}
```

Use the shared helpers in `src/lib/api/response.ts` and the wrapper in `src/lib/api/error-handler.ts`.

### Validation

- Validate query params with Zod (see `src/lib/api/validation.ts`).
- Validate request bodies with Zod before touching the database.
- Return 400/422-style errors with a stable `code`.

### Auth

- Use `requireAuth()` for endpoints that require a user/org.
- Enforce org boundaries on all Prisma queries (`where: { organizationId }`).

## Data Access (Prisma)

- Prefer narrow `select` to avoid over-fetching.
- Use transactions for multi-step read/write flows.
- Never trust client-provided `organizationId`/`userId`.

## Logging

- Do not log secrets (API keys, tokens, raw webhooks with credentials).
- When logging errors, include the requestId (from the response meta/header) where possible.

## Security & Secrets

- `.env*` files must never be committed.
- Rotate credentials immediately if they’re ever pasted into a PR/issue/chat.
- Avoid returning internal error details to clients; use stable error codes and safe messages.

## Code Review Checklist

- Types are correct; no new `any` without justification
- Zod validation at boundaries
- API responses use the standard envelope
- No secrets in logs or code
- Lint/typecheck pass locally
