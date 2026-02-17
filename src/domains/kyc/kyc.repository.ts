import { randomUUID } from "node:crypto";

import type { VerificationSessionStartInput } from "@/domains/kyc/kyc.schemas";

export type KycSessionRecord = {
  id: string;
  organizationId: string;
  userId: string;
  provider: VerificationSessionStartInput["provider"];
  documentType: VerificationSessionStartInput["documentType"];
  status: "pending" | "in_review" | "verified" | "rejected";
  createdAt: string;
  expiresAt: string;
};

const sessionsById = new Map<string, KycSessionRecord>();
const sessionIdsByOrg = new Map<string, string[]>();

function indexSession(organizationId: string, sessionId: string) {
  const existing = sessionIdsByOrg.get(organizationId) ?? [];
  sessionIdsByOrg.set(organizationId, [sessionId, ...existing]);
}

export function startKycVerificationSession(
  organizationId: string,
  userId: string,
  input: VerificationSessionStartInput,
) {
  const id = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 30);

  const record: KycSessionRecord = {
    id,
    organizationId,
    userId,
    provider: input.provider,
    documentType: input.documentType,
    status: "pending",
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  sessionsById.set(id, record);
  indexSession(organizationId, id);

  return record;
}

export function listKycSessions(organizationId: string, limit = 25) {
  const ids = sessionIdsByOrg.get(organizationId) ?? [];

  return ids
    .map((id) => sessionsById.get(id))
    .filter((record): record is KycSessionRecord => Boolean(record))
    .slice(0, limit);
}
