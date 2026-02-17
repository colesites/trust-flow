import { z } from "zod";

export const payoutTriggerSchema = z.object({
  claimId: z.string().min(8),
  amountCents: z.number().int().positive(),
  currency: z.string().length(3).default("USD"),
});

export type PayoutTriggerInput = z.infer<typeof payoutTriggerSchema>;
