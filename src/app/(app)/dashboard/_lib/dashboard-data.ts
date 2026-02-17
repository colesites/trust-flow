import { cacheLife, cacheTag } from "next/cache";

import {
  countClaimsByStatus,
  listClaims,
} from "@/domains/claims/claim.repository";
import {
  countQuotesByStatus,
  listQuotes,
} from "@/domains/distribution/quote.repository";
import { listKycSessions } from "@/domains/kyc/kyc.repository";
import {
  countUnderwritingByStatus,
  listUnderwritingCases,
} from "@/domains/underwriting/underwriting.repository";

export type DashboardSnapshot = {
  claims: ReturnType<typeof countClaimsByStatus>;
  underwriting: ReturnType<typeof countUnderwritingByStatus>;
  quotes: ReturnType<typeof countQuotesByStatus>;
};

function setDashboardCache(organizationId: string) {
  cacheLife("minutes");
  cacheTag(`dashboard:${organizationId}`);
}

export async function getDashboardSnapshot(
  organizationId: string,
): Promise<DashboardSnapshot> {
  "use cache: private";
  setDashboardCache(organizationId);
  return {
    claims: countClaimsByStatus(organizationId),
    underwriting: countUnderwritingByStatus(organizationId),
    quotes: countQuotesByStatus(organizationId),
  };
}

export async function getRecentClaims(organizationId: string) {
  "use cache: private";
  setDashboardCache(organizationId);
  return listClaims(organizationId, { limit: 5 });
}

export async function getRecentUnderwritingCases(organizationId: string) {
  "use cache: private";
  setDashboardCache(organizationId);
  return listUnderwritingCases(organizationId, { limit: 5 });
}

export async function getRecentQuotes(organizationId: string) {
  "use cache: private";
  setDashboardCache(organizationId);
  return listQuotes(organizationId, { limit: 5 });
}

export async function getRecentKycSessions(organizationId: string) {
  "use cache: private";
  setDashboardCache(organizationId);
  return listKycSessions(organizationId, 3);
}
