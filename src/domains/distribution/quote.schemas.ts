import { z } from "zod";

import { QUOTE_STATUSES } from "@/domains/distribution/quote.types";

export const quoteCreateSchema = z.object({
  productCode: z.string().min(2).max(32),
  coverageAmount: z.number().int().positive(),
  premiumCents: z.number().int().positive(),
  currency: z.string().length(3).default("USD"),
});

export const quoteListSchema = z.object({
  status: z.enum(QUOTE_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type QuoteCreateInput = z.infer<typeof quoteCreateSchema>;
export type QuoteListInput = z.infer<typeof quoteListSchema>;
