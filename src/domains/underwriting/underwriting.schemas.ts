import { z } from "zod";

import {
  UNDERWRITING_DECISIONS,
  UNDERWRITING_STATUSES,
} from "@/domains/underwriting/underwriting.types";

export const underwritingCaseCreateSchema = z.object({
  productCode: z.string().min(2).max(32),
  summary: z.string().min(20).max(2_000),
  riskScore: z.number().int().min(0).max(100),
});

export const underwritingCaseListSchema = z.object({
  status: z.enum(UNDERWRITING_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export const underwritingDecisionSchema = z.object({
  caseId: z.string().min(8),
  decision: z.enum(UNDERWRITING_DECISIONS),
  notes: z.string().max(1_000).optional(),
});

export type UnderwritingCaseCreateInput = z.infer<
  typeof underwritingCaseCreateSchema
>;
export type UnderwritingCaseListInput = z.infer<
  typeof underwritingCaseListSchema
>;
export type UnderwritingDecisionInput = z.infer<
  typeof underwritingDecisionSchema
>;
