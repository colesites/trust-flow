export const CLAIM_TYPES = [
  "collision",
  "weather",
  "theft",
  "liability",
  "property_damage",
  "medical",
] as const;

export type ClaimType = (typeof CLAIM_TYPES)[number];

export const CLAIM_STATUSES = [
  "draft",
  "submitted",
  "validating",
  "in_review",
  "approved",
  "rejected",
  "paid",
  "closed",
] as const;

export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export type ClaimTimelineEvent = {
  id: string;
  fromStatus: ClaimStatus | null;
  toStatus: ClaimStatus;
  eventType: string;
  notes?: string;
  at: string;
  actorId?: string;
};

export type ClaimRecord = {
  id: string;
  organizationId: string;
  policyId: string;
  claimantId: string;
  claimType: ClaimType;
  description: string;
  status: ClaimStatus;
  incidentDate: string;
  createdAt: string;
  updatedAt: string;
  events: ClaimTimelineEvent[];
};
