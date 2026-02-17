import { z } from "zod";

import { CLAIM_STATUSES, CLAIM_TYPES } from "@/domains/claims/claim.types";

export const claimCreateInputSchema = z.object({
  policyId: z.string().min(3),
  claimType: z.enum(CLAIM_TYPES),
  description: z
    .string()
    .min(20, "Please include enough detail for our adjuster to help quickly")
    .max(2_000),
  incidentDate: z.coerce.date(),
});

export const claimListQuerySchema = z.object({
  status: z.enum(CLAIM_STATUSES).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(25),
});

export type ClaimCreateInput = z.infer<typeof claimCreateInputSchema>;
export type ClaimListQueryInput = z.infer<typeof claimListQuerySchema>;
