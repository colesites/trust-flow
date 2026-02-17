export const UNDERWRITING_STATUSES = [
  "intake",
  "risk_check",
  "pricing",
  "approved",
  "declined",
  "referred",
] as const;

export type UnderwritingStatus = (typeof UNDERWRITING_STATUSES)[number];

export const UNDERWRITING_DECISIONS = ["approve", "decline", "refer"] as const;

export type UnderwritingDecision = (typeof UNDERWRITING_DECISIONS)[number];

export type UnderwritingCaseEvent = {
  id: string;
  status: UnderwritingStatus;
  eventType: string;
  actorId?: string;
  notes?: string;
  at: string;
};

export type UnderwritingCaseRecord = {
  id: string;
  organizationId: string;
  applicantId: string;
  status: UnderwritingStatus;
  riskScore: number;
  productCode: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  events: UnderwritingCaseEvent[];
};
