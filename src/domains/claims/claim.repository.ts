import { randomUUID } from "node:crypto";

import type {
  ClaimCreateInput,
  ClaimListQueryInput,
} from "@/domains/claims/claim.schemas";
import type {
  ClaimRecord,
  ClaimStatus,
  ClaimTimelineEvent,
} from "@/domains/claims/claim.types";
import { assertClaimTransition } from "@/domains/claims/claim-state";

const claimsById = new Map<string, ClaimRecord>();
const claimIdsByOrganization = new Map<string, string[]>();

function addClaimToOrgIndex(organizationId: string, claimId: string) {
  const existing = claimIdsByOrganization.get(organizationId) ?? [];
  claimIdsByOrganization.set(organizationId, [claimId, ...existing]);
}

function createEvent(
  eventType: string,
  fromStatus: ClaimStatus | null,
  toStatus: ClaimStatus,
  actorId?: string,
  notes?: string,
): ClaimTimelineEvent {
  return {
    id: randomUUID(),
    eventType,
    fromStatus,
    toStatus,
    actorId,
    notes,
    at: new Date().toISOString(),
  };
}

export function createClaim(
  organizationId: string,
  claimantId: string,
  input: ClaimCreateInput,
): ClaimRecord {
  const now = new Date().toISOString();
  const claimId = randomUUID();

  const initialEvent = createEvent(
    "claim_submitted",
    null,
    "submitted",
    claimantId,
    "Claim received and queued for validation",
  );

  const claim: ClaimRecord = {
    id: claimId,
    organizationId,
    policyId: input.policyId,
    claimantId,
    claimType: input.claimType,
    description: input.description,
    incidentDate: input.incidentDate.toISOString(),
    status: "submitted",
    createdAt: now,
    updatedAt: now,
    events: [initialEvent],
  };

  claimsById.set(claimId, claim);
  addClaimToOrgIndex(organizationId, claimId);

  return claim;
}

export function listClaims(
  organizationId: string,
  query: ClaimListQueryInput,
): ClaimRecord[] {
  const claimIds = claimIdsByOrganization.get(organizationId) ?? [];
  const claims = claimIds
    .map((claimId) => claimsById.get(claimId))
    .filter((claim): claim is ClaimRecord => Boolean(claim));

  const filtered = query.status
    ? claims.filter((claim) => claim.status === query.status)
    : claims;

  return filtered.slice(0, query.limit);
}

export function getClaim(claimId: string): ClaimRecord | null {
  return claimsById.get(claimId) ?? null;
}

export function transitionClaimStatus(
  claimId: string,
  toStatus: ClaimStatus,
  actorId?: string,
  notes?: string,
): ClaimRecord {
  const claim = claimsById.get(claimId);

  if (!claim) {
    throw new Error("Claim not found");
  }

  assertClaimTransition(claim.status, toStatus);

  if (claim.status === toStatus) {
    return claim;
  }

  const event = createEvent(
    "status_changed",
    claim.status,
    toStatus,
    actorId,
    notes,
  );

  const updated: ClaimRecord = {
    ...claim,
    status: toStatus,
    updatedAt: new Date().toISOString(),
    events: [event, ...claim.events],
  };

  claimsById.set(claim.id, updated);

  return updated;
}

export function countClaimsByStatus(organizationId: string) {
  const counters: Record<ClaimStatus, number> = {
    draft: 0,
    submitted: 0,
    validating: 0,
    in_review: 0,
    approved: 0,
    rejected: 0,
    paid: 0,
    closed: 0,
  };

  const claimIds = claimIdsByOrganization.get(organizationId) ?? [];

  for (const claimId of claimIds) {
    const claim = claimsById.get(claimId);
    if (!claim) {
      continue;
    }
    counters[claim.status] += 1;
  }

  return counters;
}
