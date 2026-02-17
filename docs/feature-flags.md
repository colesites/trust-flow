# TrustFlow Feature Flags (v1)

TrustFlow supports runtime feature gates through `TRUSTFLOW_FEATURE_FLAGS` in the environment.

## Format

Comma-separated list of enabled flags:

```bash
TRUSTFLOW_FEATURE_FLAGS=claims_v1,underwriting_v1,distribution_v1,kyc_v1,payouts_v1,ai_v1
```

If not set, all known v1 flags are enabled by default.

## Supported flags

- `claims_v1`
- `underwriting_v1`
- `distribution_v1`
- `kyc_v1`
- `payouts_v1`
- `ai_v1`

## Behavior

- Each API route checks the relevant flag through `src/lib/api/route.ts`.
- Disabled features return a standard `404 not_found` envelope.
- Feature checks run before route business logic.
