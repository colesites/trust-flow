import { randomUUID } from "node:crypto";

import type {
  QuoteCreateInput,
  QuoteListInput,
} from "@/domains/distribution/quote.schemas";
import type {
  QuoteRecord,
  QuoteStatus,
} from "@/domains/distribution/quote.types";

const quotesById = new Map<string, QuoteRecord>();
const quoteIdsByOrganization = new Map<string, string[]>();

function indexQuote(organizationId: string, quoteId: string) {
  const existing = quoteIdsByOrganization.get(organizationId) ?? [];
  quoteIdsByOrganization.set(organizationId, [quoteId, ...existing]);
}

export function createQuote(
  organizationId: string,
  customerId: string,
  input: QuoteCreateInput,
) {
  const now = new Date().toISOString();
  const quoteId = randomUUID();

  const record: QuoteRecord = {
    id: quoteId,
    organizationId,
    customerId,
    productCode: input.productCode,
    coverageAmount: input.coverageAmount,
    premiumCents: input.premiumCents,
    currency: input.currency,
    status: "presented",
    createdAt: now,
    updatedAt: now,
  };

  quotesById.set(quoteId, record);
  indexQuote(organizationId, quoteId);

  return record;
}

export function listQuotes(organizationId: string, query: QuoteListInput) {
  const ids = quoteIdsByOrganization.get(organizationId) ?? [];
  const records = ids
    .map((quoteId) => quotesById.get(quoteId))
    .filter((record): record is QuoteRecord => Boolean(record));

  const filtered = query.status
    ? records.filter((record) => record.status === query.status)
    : records;

  return filtered.slice(0, query.limit);
}

export function countQuotesByStatus(organizationId: string) {
  const counters: Record<QuoteStatus, number> = {
    draft: 0,
    presented: 0,
    accepted: 0,
    rejected: 0,
    expired: 0,
  };

  const ids = quoteIdsByOrganization.get(organizationId) ?? [];

  for (const quoteId of ids) {
    const record = quotesById.get(quoteId);

    if (!record) {
      continue;
    }

    counters[record.status] += 1;
  }

  return counters;
}
