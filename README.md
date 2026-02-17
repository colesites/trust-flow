# TrustFlow

TrustFlow is a Next.js 16 insurance platform foundation focused on customer experience for claims, underwriting, KYC, and distribution.

## Stack

- Next.js 16 App Router
- Bun
- TypeScript
- Tailwind CSS v4 + shadcn-style components
- Better Auth (session auth + sign-in/sign-up + protected dashboard)
- Prisma schema for Neon Postgres
- Vercel AI SDK + AI Gateway route scaffolding
- Feature-flagged APIs + structured request instrumentation

## Prerequisites

- Bun 1.3+
- Node 20+

## Setup

1. Install dependencies:

```bash
bun install
```

2. Create environment values:

```bash
cp .env.example .env
```

3. Run the app:

```bash
bun dev
```

## Scripts

- `bun dev` - start local dev server
- `bun lint` - run Biome checks
- `bun typecheck` - run TypeScript checks
- `bun test` - run unit tests
- `bun db:generate` - generate Prisma client
- `bun db:migrate:dev` - create/apply a development migration

## App routes

- `/` - public landing page
- `/sign-in` - authentication entry
- `/sign-up` - customer registration
- `/dashboard` - authenticated operations dashboard

## API routes included

- `POST /api/v1/claims` - create a claim (session-scoped org/user)
- `GET /api/v1/claims` - list claims with pagination/status query
- `GET|POST /api/v1/underwriting/cases` - underwriting case listing/creation
- `POST /api/v1/underwriting/cases/decision` - capture underwriting decision
- `GET|POST /api/v1/distribution/quotes` - quote listing/creation
- `POST /api/v1/kyc/sessions` - start KYC verification session
- `POST /api/v1/uploads/signed-url` - get a short-lived upload URL
- `POST /api/v1/payouts` - idempotent payout trigger
- `POST /api/ai/claim-intake` - structured claim extraction via AI Gateway
- `POST /api/ai/document-summarizer` - evidence summarization
- `POST /api/ai/support-copilot` - support response drafting
- `POST /api/ai/underwriting-insight` - explainable underwriting helper
- `/api/auth/*` - Better Auth Next.js handler

## Notes

- `prisma/schema.prisma` includes core insurance entities plus Better Auth tables.
- Prisma 7 datasource configuration is in `prisma.config.ts` (not `datasource.url` in schema).
- Domain repositories are currently in-memory to keep foundation iteration fast.
- API auth context uses Better Auth sessions with a test-only auth override for route tests.
- API routes emit `x-request-id` and latency headers and can be gated by `TRUSTFLOW_FEATURE_FLAGS`.
- Set `AI_GATEWAY_MODEL` to a current model ID in your environment before using the AI route.
- Incident baseline runbook: `docs/incident-runbook.md`.
- Feature flag guide: `docs/feature-flags.md`.
