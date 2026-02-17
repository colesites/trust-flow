import { randomUUID } from "node:crypto";

import type { PayoutTriggerInput } from "@/domains/payouts/payout.schemas";

export type PayoutRecord = {
  id: string;
  organizationId: string;
  idempotencyKey: string;
  initiatedById: string;
  claimId: string;
  amountCents: number;
  currency: string;
  status: "queued" | "processing" | "paid" | "failed";
  createdAt: string;
};

const payoutByIdempotencyKey = new Map<string, PayoutRecord>();

function makeCompositeKey(organizationId: string, idempotencyKey: string) {
  return `${organizationId}:${idempotencyKey}`;
}

export function triggerPayout(
  organizationId: string,
  idempotencyKey: string,
  initiatedById: string,
  input: PayoutTriggerInput,
) {
  const compositeKey = makeCompositeKey(organizationId, idempotencyKey);
  const existing = payoutByIdempotencyKey.get(compositeKey);

  if (existing) {
    return existing;
  }

  const record: PayoutRecord = {
    id: randomUUID(),
    organizationId,
    idempotencyKey,
    initiatedById,
    claimId: input.claimId,
    amountCents: input.amountCents,
    currency: input.currency,
    status: "queued",
    createdAt: new Date().toISOString(),
  };

  payoutByIdempotencyKey.set(compositeKey, record);

  return record;
}
