import { randomUUID } from "node:crypto";

import type {
  UnderwritingCaseCreateInput,
  UnderwritingCaseListInput,
  UnderwritingDecisionInput,
} from "@/domains/underwriting/underwriting.schemas";
import type {
  UnderwritingCaseEvent,
  UnderwritingCaseRecord,
  UnderwritingStatus,
} from "@/domains/underwriting/underwriting.types";

const casesById = new Map<string, UnderwritingCaseRecord>();
const caseIdsByOrganization = new Map<string, string[]>();

const transitionMap = new Map<
  UnderwritingStatus,
  ReadonlySet<UnderwritingStatus>
>([
  ["intake", new Set(["risk_check", "declined", "referred"])],
  ["risk_check", new Set(["pricing", "declined", "referred"])],
  ["pricing", new Set(["approved", "declined", "referred"])],
  ["approved", new Set()],
  ["declined", new Set()],
  ["referred", new Set(["risk_check", "pricing", "approved", "declined"])],
]);

function createEvent(
  status: UnderwritingStatus,
  eventType: string,
  actorId?: string,
  notes?: string,
): UnderwritingCaseEvent {
  return {
    id: randomUUID(),
    status,
    eventType,
    actorId,
    notes,
    at: new Date().toISOString(),
  };
}

function pushOrgCaseIndex(organizationId: string, caseId: string) {
  const existing = caseIdsByOrganization.get(organizationId) ?? [];
  caseIdsByOrganization.set(organizationId, [caseId, ...existing]);
}

function assertTransition(
  fromStatus: UnderwritingStatus,
  toStatus: UnderwritingStatus,
) {
  if (fromStatus === toStatus) {
    return;
  }

  const allowed = transitionMap.get(fromStatus);

  if (!allowed?.has(toStatus)) {
    throw new Error(
      `Invalid underwriting transition: ${fromStatus} -> ${toStatus}`,
    );
  }
}

export function createUnderwritingCase(
  organizationId: string,
  applicantId: string,
  input: UnderwritingCaseCreateInput,
) {
  const now = new Date().toISOString();
  const caseId = randomUUID();

  const record: UnderwritingCaseRecord = {
    id: caseId,
    organizationId,
    applicantId,
    status: "intake",
    riskScore: input.riskScore,
    productCode: input.productCode,
    summary: input.summary,
    createdAt: now,
    updatedAt: now,
    events: [
      createEvent(
        "intake",
        "case_created",
        applicantId,
        "Case created and queued for risk review",
      ),
    ],
  };

  casesById.set(caseId, record);
  pushOrgCaseIndex(organizationId, caseId);

  return record;
}

export function listUnderwritingCases(
  organizationId: string,
  query: UnderwritingCaseListInput,
) {
  const ids = caseIdsByOrganization.get(organizationId) ?? [];
  const records = ids
    .map((caseId) => casesById.get(caseId))
    .filter((record): record is UnderwritingCaseRecord => Boolean(record));

  const filtered = query.status
    ? records.filter((record) => record.status === query.status)
    : records;

  return filtered.slice(0, query.limit);
}

export function applyUnderwritingDecision(
  input: UnderwritingDecisionInput,
  actorId: string,
) {
  const record = casesById.get(input.caseId);

  if (!record) {
    throw new Error("Underwriting case not found");
  }

  const decisionStatusMap: Record<
    UnderwritingDecisionInput["decision"],
    UnderwritingStatus
  > = {
    approve: "approved",
    decline: "declined",
    refer: "referred",
  };

  const toStatus = decisionStatusMap[input.decision];
  assertTransition(record.status, toStatus);

  const updated: UnderwritingCaseRecord = {
    ...record,
    status: toStatus,
    updatedAt: new Date().toISOString(),
    events: [
      createEvent(
        toStatus,
        "decision_captured",
        actorId,
        input.notes ?? `Decision recorded: ${input.decision}`,
      ),
      ...record.events,
    ],
  };

  casesById.set(record.id, updated);

  return updated;
}

export function countUnderwritingByStatus(organizationId: string) {
  const counters: Record<UnderwritingStatus, number> = {
    intake: 0,
    risk_check: 0,
    pricing: 0,
    approved: 0,
    declined: 0,
    referred: 0,
  };

  const ids = caseIdsByOrganization.get(organizationId) ?? [];

  for (const caseId of ids) {
    const record = casesById.get(caseId);

    if (!record) {
      continue;
    }

    counters[record.status] += 1;
  }

  return counters;
}
