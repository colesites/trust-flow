# TrustFlow Insurance Platform — Full Build Plan (Next.js 16 + Bun + Neon + Prisma)
**Theme:** White + Green (clean, alive, premium)  
**Domain Focus:** Claims Processing, Underwriting, Customer Experience (primary), Product Distribution  
**Non-negotiables:** TypeScript-only • Bun-only • Next.js 16 (App Router) • Prisma ORM • Neon Postgres • shadcn/ui • AI SDK via gateway • Next cache components • Secure-by-default • Testing at every layer

---

## 0) Skills.sh Knowledge Packs (must be applied)
Use these as authoritative rules/guidelines throughout:
- `vercel-react-best-practices`
- `web-design-guidelines`
- `frontend-design`
- `next-best-practices`
- `better-auth-best-practices`
- `ai-sdk`
- `api-design-principles`
- `next-cache-components`
- `tailwind-design-system`
- `prisma-expert`
- `neon-postgres`
- `shadcn-ui`
- `ui-ux-pro-max`

**Acceptance:** Every PR must reference which pack(s) it follows.

---

## 1) Product North Star (Customer Experience First)
### Customer Experience principles
- **Fast:** instant feedback, optimistic UI where safe, skeletons, micro-interactions
- **Clear:** plain language, next-step guidance, visible progress
- **Trustworthy:** transparent status, audit trail, strong security cues without fear
- **Accessible:** keyboard-first, high contrast option, readable spacing/typography
- **Responsive:** mobile-first, tablet-perfect, desktop-polished

### Core journeys (must feel “alive”)
1. **Customer Claim Journey** (submit → validate → track → communicate → payout)
2. **Underwriting Journey** (intake → risk checks → pricing → decision → issuance)
3. **Distribution Journey** (product discovery → quote → purchase → renewal)

---

## 2) System Architecture (Next.js 16 App Router)
### High-level
- **Web App:** Next.js 16 App Router (RSC-first, client islands only where needed)
- **Data:** Neon Postgres + Prisma
- **Auth:** BetterAuth (session + roles + orgs + device trust)
- **Files:** Object storage (S3-compatible) for KYC docs/claim evidence + signed URLs
- **AI:** Vercel AI SDK using **gateway** pattern (provider-agnostic)
- **Observability:** logs, metrics, traces, error reporting
- **Security:** WAF/rate limits, strict headers, RBAC/ABAC, audit trails

### App layers
- **UI Layer:** shadcn/ui + Tailwind design system + motion/interaction layer
- **Domain Layer:** Claims, Underwriting, Distribution, Customer Experience (shared)
- **API Layer:** route handlers + service modules (no fat controllers)
- **Data Layer:** Prisma schema + repository pattern + transactions
- **AI Layer:** prompt + tools + guardrails + evaluation harness

---

## 3) Design System (White + Green)
### Brand tokens (example)
- `--bg`: #FFFFFF
- `--fg`: near-black (soft)
- `--primary`: green (brand), with 2-3 shades for states
- `--muted`: light gray surfaces
- `--success/warn/error`: semantic tokens
- **Radius:** 12–16px for “premium” feel
- **Shadow:** soft, layered
- **Typography:** clean sans (system or chosen brand font)

### UI rules (must)
- No clutter: generous spacing, strong hierarchy
- Consistent component states (hover/focus/disabled/loading)
- Motion: subtle, purposeful (no gimmicks)
- Every form has: inline validation + helper text + error recovery + “why we ask this”

### CX signature moments
- Claim status timeline (delightful, calm)
- Smart document capture UX (scan/upload guidance)
- “Next best action” prompts (AI-assisted, but always human-readable)

---

## 4) Data Model (Prisma + Neon)
### Key entities
- **User, Organization, Membership** (roles + permissions)
- **Policy, Product, Quote**
- **Claim, ClaimEvent, ClaimDocument, Payout**
- **UnderwritingCase, RiskSignal, Decision, PricingFactor**
- **KYCProfile, KYCCheck, KYCDocument, VerificationSession**
- **Notification, MessageThread, Message**
- **AuditLog** (who/what/when/why)
- **FeatureFlag** (safe rollout)

### Data rules
- Use **indexes** intentionally (by org_id, user_id, claim_id, status, created_at)
- Use **transactions** for state transitions
- Use **soft delete** only where compliance demands it; otherwise hard delete with audit
- PII separation where possible (encryption + access boundaries)

---

## 5) Auth + Security (BetterAuth)
### Auth requirements
- Email/password + magic link (optional), OAuth optional
- Session management, refresh, device management
- Role model: `customer`, `agent`, `adjuster`, `underwriter`, `admin`, `super_admin`
- Organization scoping: every record belongs to an org (multi-tenant)
- Row-level authorization enforced in service layer

### Platform security checklist
- Strict CSP, HSTS, secure cookies, CSRF protection, same-site policies
- Rate limiting (login, OTP, AI endpoints, file uploads)
- Input validation with Zod everywhere (client + server)
- Audit logs for all sensitive actions
- Secrets management (no secrets in client; rotate keys)

---

## 6) KYC (Know Your Customer) — How it will work
### KYC flow (customer-friendly)
1. **Start verification**: user is told what’s needed and why (trust copy)
2. **Capture ID**: upload or camera capture (guided UI)
3. **Liveness/selfie check** (if required)
4. **Data extraction**: name/DOB/document number (auto-fill, editable with warnings)
5. **Verification decision**: pass/fail/manual review
6. **Ongoing monitoring** (optional): triggers on risky changes

### What we’ll use to build it
- **Verification provider integration** (choose one):
  - Option A: Hosted verification flow (fastest to ship, best UX)
  - Option B: API-based flow (more control; more engineering)
- **Storage:** signed uploads to object storage for docs; store only references in DB
- **Security:** encrypt at rest, short-lived URLs, strict access policies
- **Manual review tools:** internal dashboard for agents/underwriters

### KYC data design
- `KYCProfile` (status, risk level)
- `KYCCheck` (provider, result, timestamps)
- `KYCDocument` (type, storage pointer, checksum, metadata)
- **No raw docs in app bundle**; never expose direct file URLs

---

## 7) AI Features (Vercel AI SDK via Gateway)
### AI principles
- AI must **improve CX**: clarity, speed, fewer mistakes
- Guardrails: refusal for sensitive requests, privacy redaction, tool constraints
- Human-in-the-loop for decisions that affect payouts/eligibility

### AI feature set (v1)
1. **Claim Intake Assistant**
   - turns messy user text into structured claim fields
   - asks smart follow-up questions
2. **Document Summarizer**
   - summarizes evidence + extracts key facts
3. **Customer Support Copilot**
   - drafts replies in brand voice + suggests next actions
4. **Underwriting Insight Helper**
   - explains decision factors in plain English (no secret sauce leakage)

### Gateway pattern (must)
- One internal AI endpoint: `/api/ai/*`
- Provider routing configured server-side (no provider keys in client)
- Observability: log prompts/tokens safely (redacted), track latency and cost

### AI evaluation
- Gold datasets (anonymized)
- Regression checks for extraction accuracy + hallucination rate
- Prompt versioning + rollback

---

## 8) Performance + Next Cache Components (Next.js 16)
### Strategy
- RSC-first pages, stream where helpful
- Use Next caching primitives for read-heavy views (dashboards, timelines)
- Cache invalidation tied to domain events (e.g., claim status changes)
- Avoid over-caching anything user-sensitive; scope cache by org/user where needed

### Performance goals
- Lighthouse: 90+ on key pages
- TTI: < 3s on mid devices
- Instant-feel navigation with prefetch + skeletons

---

## 9) Data Structures & Algorithms (practical rules)
- Use **hashmaps** for quick lookups in service logic (e.g., status mapping, rules tables)
- Think in **Big-O** for hotspots:
  - avoid nested loops on large datasets (claims lists, messages)
  - paginate always; never “load all”
- Batch DB operations; use `IN (...)` queries carefully
- Prefer set-based SQL thinking; let DB do the heavy lifting

---

## 10) API Design (clean + scalable)
- REST-ish route handlers or typed RPC style—pick one and enforce consistently
- Versioning strategy (`/api/v1`)
- Standard response envelope + error codes
- Idempotency keys for payments/payout triggers
- Zod schemas shared between client/server for contracts

---

## 11) Testing Strategy (Unit • Component • E2E)
### Unit tests
- Domain services (claims transitions, underwriting rules, auth gates)
- Utilities (formatting, validators, mapping)

### Component tests
- Critical UI flows: claim form, status timeline, upload widget, auth screens
- Accessibility assertions (keyboard nav, aria, contrast where possible)

### End-to-end tests
- Customer claim journey (happy + edge cases)
- Underwriter review journey
- KYC flow (mock provider + sandbox)
- AI endpoints (mock gateway + snapshot outputs + regression dataset)

### Quality gates
- Pre-commit: typecheck + lint
- PR: unit + component
- Main: E2E + performance budget checks

---

## 12) Production Readiness (Vercel + Neon)
### Environments
- `dev` → `staging` → `prod`
- Separate DBs + separate storage buckets + separate auth keys

### CI/CD
- Bun install + caching
- Database migrations with safety rules
- Preview deployments per PR

### Observability & ops
- Error reporting (frontend + backend)
- Structured logs with request IDs
- Monitoring for:
  - auth failures
  - upload errors
  - AI latency/cost spikes
  - DB slow queries

### Security ops
- Dependency scanning
- Secret scanning
- Regular key rotation
- Incident runbook

---

## 13) Milestones (ship in slices)
1. **Foundation:** repo, design system, auth, orgs, RBAC, DB schema
2. **Claims v1:** intake, uploads, timeline, internal dashboard
3. **KYC v1:** verification flow + storage + review tools
4. **Underwriting v1:** case intake + decision capture + explainability UI
5. **AI v1:** claim assistant + summaries + support copilot
6. **Distribution v1:** product catalog + quote + purchase flow
7. **Hardening:** perf, caching, security, accessibility, scale testing

---

# ✅ MASTER PROMPT for GPT-5.3 (paste into GPT-5.3 / Codex)
You are GPT-5.3 acting as a Staff+ Engineer, Product Designer, and QA Lead. Build the **TrustFlow Insurance Platform** end-to-end using:
- Next.js 16 App Router + Next cache components
- Bun only (no npm/yarn/pnpm)
- TypeScript only (no JS)
- Neon Postgres + Prisma ORM
- shadcn/ui + Tailwind design system (**white + green theme**)
- BetterAuth for authentication
- Vercel AI SDK via **Gateway** pattern for AI features
- Apply skills.sh packs strictly: vercel-react-best-practices, web-design-guidelines, frontend-design, next-best-practices, better-auth-best-practices, ai-sdk, api-design-principles, next-cache-components, tailwind-design-system, prisma-expert, neon-postgres, shadcn-ui, ui-ux-pro-max.

## Your output must include:
1) A complete implementation plan (tasks, order, milestones)
2) Repo structure (folders, naming, boundaries, conventions)
3) Database schema (Prisma) covering Claims, Underwriting, Customer Experience, Product Distribution + audit logs + KYC entities
4) Auth design (BetterAuth), multi-tenant org model, roles/permissions, secure session patterns
5) KYC implementation details:
   - provider-agnostic interface
   - hosted vs API-based approach
   - secure doc upload (signed URLs), encryption considerations, manual review dashboard
6) AI features using AI SDK + gateway:
   - claim intake assistant (structured extraction + follow-ups)
   - document summarizer
   - support copilot
   - underwriting insight helper
   - include prompt templates, tool design, privacy redaction, eval harness
7) UI/UX system:
   - tokens, components, motion rules, empty states, skeletons
   - responsive layouts
   - accessibility checklist and implementation notes
8) Performance plan:
   - RSC-first strategy
   - caching strategy using Next cache components
   - invalidation rules tied to domain events
9) API design:
   - route handlers/contracts with Zod
   - error model, idempotency, pagination, rate limiting
10) Testing:
   - unit tests (domain services)
   - component tests (critical UI)
   - E2E tests (journeys + KYC + AI endpoints)
   - CI gates and coverage targets
11) Production:
   - Vercel deployment strategy
   - environment separation
   - migrations safety
   - observability (logs/metrics/traces)
   - security hardening checklist

## Hard constraints:
- Must be scalable, secure, maintainable
- Must apply data structures & algorithms principles (hashmaps, Big-O thinking) where relevant
- No “hand-wavy” sections: provide concrete file names, code scaffolds, and examples
- Keep UI “alive”: micro-interactions, progress indicators, friendly copy, zero clutter
- Everything must be consistent with the skills.sh best practices packs

## Deliverables format:
- Start with an architecture diagram description (text-based)
- Then produce a task breakdown with checkboxes
- Then produce code scaffolding snippets for critical parts (Prisma schema, auth setup, AI gateway endpoint, claim intake form, upload handler, caching example, one domain service + tests)
- End with a launch checklist and rollout plan (feature flags + monitoring)

Proceed now.
