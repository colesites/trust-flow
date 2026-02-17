# TrustFlow Incident Runbook (v1)

## Scope

This runbook covers the highest-risk customer-impacting incidents in the current TrustFlow foundation:

- claim submission degradation
- authentication outage
- signed upload failures
- AI endpoint instability

## Severity model

- `SEV-1`: customer-facing outage across core flows (`/dashboard`, claim POST, auth)
- `SEV-2`: partial degradation with workaround (single domain API down, elevated errors)
- `SEV-3`: minor degradation, low blast radius

## First 10 minutes

1. Confirm incident and assign commander.
2. Capture timestamp, impacted routes, and observed error signatures.
3. Freeze risky deploys and migrations.
4. Enable protective feature flags when needed:
   - disable `ai_v1` during provider instability
   - disable `kyc_v1` if upload flow is failing hard
5. Post first status update to stakeholders with next update ETA.

## Service-specific playbooks

### Claim submission degradation

1. Check `POST /api/v1/claims` responses and validation error rates.
2. Verify auth context extraction and permission gate behavior.
3. Confirm request IDs from `x-request-id` headers for failing samples.
4. If scope is large, temporarily route users to support fallback channel.

### Authentication outage

1. Check `/api/auth/*` route availability.
2. Verify Better Auth secret and URL environment values.
3. Confirm session cookie presence (`better-auth.session_token` variants).
4. If database adapter rollout was recent, roll back to last known good config.

### Upload/KYC failures

1. Check `POST /api/v1/uploads/signed-url` and `POST /api/v1/kyc/sessions`.
2. Validate content-type enforcement behavior and rate-limit status.
3. If storage backend is unstable, disable `kyc_v1` and notify support.

### AI instability

1. Check `/api/ai/*` latency and 5xx rate.
2. Verify `AI_GATEWAY_MODEL` and gateway key settings.
3. Toggle `ai_v1` off if high error rate persists.
4. Fall back to manual workflows in customer/ops messaging.

## Recovery and closeout

1. Confirm error rates and latency return to baseline.
2. Keep heightened monitoring for 30 minutes.
3. Publish resolution summary with root cause and corrective actions.
4. Create follow-up tasks with owners and deadlines.
