# Echodod

AWS communication implementation and maintenance services for small and medium businesses. We set up and manage Amazon Connect (phone), Amazon Pinpoint (messaging), and Amazon SES (email) so business owners can focus on running their business.

## Business Model

- **One-time implementation fee**: Basic ($999), Standard ($2,499), Premium ($4,999)
- **Monthly maintenance**: Essential ($149/mo), Professional ($349/mo), Enterprise ($699/mo)
- Clients pay their own AWS bills directly
- Dashboard for business owners to manage hours, contacts, and greetings
- Admin panel for super admins to manage all clients

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: NextAuth v5 (credentials + OAuth)
- **Billing**: Stripe (one-time payments + subscriptions)
- **Email**: Resend SDK
- **Cache**: Redis (rate limiting)
- **UI**: Radix UI + Tailwind CSS + Recharts + Framer Motion

## Developer Docs

- Coding standards: ./CODING_STANDARDS.md
- Contributing: ./CONTRIBUTING.md

## Setup

### Prerequisites

- Node.js 18+
- pnpm
- PostgreSQL 16 (or a Neon/Supabase database)
- Redis 7 (optional, for rate limiting)

### Quick Start

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Configure environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update `.env` with your credentials. Required variables:

   | Variable                             | Description                                            |
   | ------------------------------------ | ------------------------------------------------------ |
   | `DATABASE_URL`                       | PostgreSQL connection string                           |
   | `NEXTAUTH_SECRET`                    | Random secret for session encryption                   |
   | `NEXTAUTH_URL`                       | App URL (http://localhost:3001 for dev)                |
   | `NEXT_PUBLIC_APP_URL`                | Public app URL                                         |
   | `STRIPE_SECRET_KEY`                  | Stripe API secret key                                  |
   | `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret                          |
   | `STRIPE_BASIC_IMPL_PRICE_ID`         | Stripe price ID for Basic implementation ($999)        |
   | `STRIPE_STANDARD_IMPL_PRICE_ID`      | Stripe price ID for Standard implementation ($2,499)   |
   | `STRIPE_PREMIUM_IMPL_PRICE_ID`       | Stripe price ID for Premium implementation ($4,999)    |
   | `STRIPE_ESSENTIAL_MAINT_PRICE_ID`    | Stripe price ID for Essential maintenance ($149/mo)    |
   | `STRIPE_PROFESSIONAL_MAINT_PRICE_ID` | Stripe price ID for Professional maintenance ($349/mo) |
   | `STRIPE_ENTERPRISE_MAINT_PRICE_ID`   | Stripe price ID for Enterprise maintenance ($699/mo)   |
   | `RESEND_API_KEY`                     | Resend API key for transactional emails                |
   | `REDIS_URL`                          | Redis connection string (optional)                     |

3. **Start local services (optional):**

   ```bash
   docker compose up -d
   ```

   This starts PostgreSQL 16 and Redis 7 locally.

4. **Setup database:**

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Seed demo data:**

   ```bash
   pnpm prisma db seed
   ```

   Creates two test accounts:
   - **Demo user**: demo@syntaxvoice.com / password123
   - **Admin user**: admin@syntaxvoice.com / admin123

6. **Start dev server:**

   ```bash
   pnpm dev
   ```

   Visit http://localhost:3001

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Authenticated app pages
│   │   ├── admin/          # Super admin panel (clients, tickets, maintenance)
│   │   ├── business/       # My Business (profile, hours, holidays, greetings)
│   │   ├── dashboard/      # Dashboard with metrics and activity
│   │   ├── logs/           # Communication logs
│   │   ├── analytics/      # Channel analytics and charts
│   │   └── settings/       # Phone numbers, API keys, webhooks, team, billing
│   ├── (marketing)/        # Public marketing pages
│   │   ├── solutions/      # Phone Systems, Messaging, Email detail pages
│   │   ├── pricing/        # Implementation + maintenance pricing
│   │   ├── how-it-works/   # Process steps
│   │   └── contact/        # Contact/consultation form
│   └── api/                # API routes
│       ├── admin/          # Admin endpoints (clients, tickets, maintenance)
│       ├── client-profile/ # Business profile CRUD
│       ├── business-hours/ # Operating hours
│       ├── greetings/      # Channel greeting messages
│       ├── holidays/       # Holiday schedule
│       ├── services/       # AWS service configs (view-only)
│       ├── logs/           # Communication logs
│       ├── analytics/      # Analytics aggregations
│       ├── dashboard/      # Dashboard metrics
│       ├── checkout/       # Stripe checkout (implementation + maintenance)
│       ├── webhooks/       # Stripe webhook handler
│       └── settings/       # API keys, webhooks, phone numbers, billing
├── components/
│   ├── dashboard/          # Dashboard components (onboarding, warnings)
│   ├── marketing/          # Marketing components (hero, pricing, FAQ, etc.)
│   └── ui/                 # Shared UI components (Radix-based)
├── lib/
│   ├── api/                # Server-side auth, error handling, validation schemas
│   ├── api-client.ts       # Client-side API helper
│   ├── api-client-settings.ts  # Settings-specific API methods
│   ├── stripe.ts           # Stripe config (implementation tiers + maintenance plans)
│   ├── email.ts            # Email templates (Resend)
│   ├── db.ts               # Prisma client singleton
│   └── site.ts             # Site config (nav, solutions, footer)
└── styles/
    └── globals.css         # Tailwind + custom theme variables
```

## Stripe Configuration

### Development (Test Mode)

1. Get test keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Create 6 products in test mode:
   - 3 one-time products for implementation tiers (Basic, Standard, Premium)
   - 3 recurring products for maintenance plans (Essential, Professional, Enterprise)
3. Copy the price IDs to `.env`
4. Start the Stripe CLI for local webhook testing:
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

### Production

1. Create the same 6 products with live prices in Stripe Dashboard
2. Add webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`

## Commands

| Command              | Description                       |
| -------------------- | --------------------------------- |
| `pnpm dev`           | Start Next.js dev server          |
| `pnpm build`         | Production build                  |
| `pnpm test`          | Run tests (Vitest)                |
| `pnpm lint`          | ESLint check                      |
| `pnpm typecheck`     | TypeScript type check             |
| `pnpm format`        | Format code (Prettier)            |
| `pnpm format:check`  | Check formatting                  |
| `pnpm prisma studio` | Open Prisma Studio (database GUI) |
