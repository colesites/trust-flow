# TrustFlow Implementation Blueprint

## Architecture Diagram (text)

```text
[Customer Browser]
  -> Next.js App Router UI (Landing, Auth, Dashboard)
    -> Route Handlers (/api/v1/*, /api/ai/*)
      -> Domain Services (Claims, Underwriting, Distribution, KYC, Payouts)
        -> Repositories (in-memory now; Prisma-ready interfaces)
          -> Neon Postgres via Prisma (schema complete, connection pending)
      -> Better Auth (/api/auth/*, session + role context)
      -> AI Gateway via Vercel AI SDK (structured outputs + redaction)
      -> Storage Signed URL service (provider-agnostic contract)
```

## Task Breakdown

- [x] Public landing page + authenticated dashboard route split
- [x] Sign-in/sign-up UX and session-based access control
- [x] Claims API with validation, role checks, cache invalidation
- [x] Underwriting API + decision workflow
- [x] Distribution quote API
- [x] KYC session and signed upload scaffolding
- [x] Payout idempotency endpoint
- [x] AI feature endpoint set (`claim-intake`, `document-summarizer`, `support-copilot`, `underwriting-insight`)
- [x] Unit, component, and API route tests
- [x] Proxy auth-guard tests + cross-domain customer journey integration test
- [x] CI quality gate (lint, typecheck, tests)
- [x] Feature-flag and API observability baseline (request IDs + latency)

## Critical Scaffold References

- Prisma schema: `prisma/schema.prisma`
- Auth setup: `src/lib/auth/server.ts`, `src/lib/auth/session.ts`, `src/lib/auth/request-context.ts`
- Auth client UI: `src/components/trust-flow/sign-in-card.tsx`, `src/components/trust-flow/sign-up-card.tsx`
- Dashboard: `src/app/(app)/dashboard/page.tsx`
- Claims API: `src/app/api/v1/claims/route.ts`
- Underwriting API: `src/app/api/v1/underwriting/cases/route.ts`
- Upload handler: `src/app/api/v1/uploads/signed-url/route.ts`
- API route wrapper (feature gates + observability): `src/lib/api/route.ts`
- Cache example: `src/app/(app)/dashboard/page.tsx` (`use cache: private`, `cacheTag`, `cacheLife`)
- Domain service + tests:
  - `src/domains/claims/claim.repository.ts`
  - `src/domains/claims/claim-state.ts`
  - `src/domains/claims/claim-state.test.ts`

## Launch Checklist and Rollout

- [ ] Enable Neon database and run `bun db:generate` + `bun db:migrate:dev`
- [ ] Switch Better Auth from memory adapter to Prisma adapter
- [ ] Replace signed URL mock with real S3-compatible provider
- [ ] Configure feature flags by domain (`claims_v1`, `underwriting_v1`, `kyc_v1`, `ai_v1`)
- [ ] Enable staging canary rollout (10% orgs -> 50% -> 100%)
- [ ] Monitor auth errors, upload errors, AI latency/cost, and slow queries
- [ ] Run incident drill for claim submission degradation and AI fallback mode
