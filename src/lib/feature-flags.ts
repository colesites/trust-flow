import { env } from "@/lib/env";

export const FEATURE_FLAG_KEYS = [
  "claims_v1",
  "underwriting_v1",
  "distribution_v1",
  "kyc_v1",
  "payouts_v1",
  "ai_v1",
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

const knownFeatureFlags = new Set<string>(FEATURE_FLAG_KEYS);
const defaultEnabledFeatureFlags = new Set<FeatureFlagKey>(FEATURE_FLAG_KEYS);

function parseConfiguredFeatureFlags(value: string | undefined) {
  if (!value) {
    return defaultEnabledFeatureFlags;
  }

  const configured = new Set<FeatureFlagKey>();

  for (const entry of value.split(",")) {
    const normalized = entry.trim().toLowerCase();

    if (knownFeatureFlags.has(normalized)) {
      configured.add(normalized as FeatureFlagKey);
    }
  }

  return configured;
}

const enabledFlags = parseConfiguredFeatureFlags(env.TRUSTFLOW_FEATURE_FLAGS);

export function isFeatureEnabled(flag: FeatureFlagKey) {
  return enabledFlags.has(flag);
}
