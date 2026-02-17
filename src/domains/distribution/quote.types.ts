export const QUOTE_STATUSES = [
  "draft",
  "presented",
  "accepted",
  "rejected",
  "expired",
] as const;

export type QuoteStatus = (typeof QUOTE_STATUSES)[number];

export type QuoteRecord = {
  id: string;
  organizationId: string;
  customerId: string;
  productCode: string;
  coverageAmount: number;
  premiumCents: number;
  currency: string;
  status: QuoteStatus;
  createdAt: string;
  updatedAt: string;
};
