import { z } from "zod";

import { CLAIM_TYPES } from "@/domains/claims/claim.types";
import { redactSensitiveText } from "@/lib/ai/redaction";
import { runStructuredAI } from "@/lib/ai/run-structured";
import {
  internalError,
  success,
  tooManyRequests,
  validationError,
} from "@/lib/api/response";
import { withApiRoute } from "@/lib/api/route";
import { consumeRateLimit } from "@/lib/security/rate-limit";

const claimIntakeRequestSchema = z.object({
  claimText: z.string().min(30).max(8_000),
  policyContext: z
    .object({
      policyId: z.string().min(3),
      productName: z.string().optional(),
    })
    .optional(),
});

const claimIntakeOutputSchema = z.object({
  summary: z.string(),
  claimType: z.enum(CLAIM_TYPES),
  severity: z.enum(["low", "medium", "high"]),
  requiredDocuments: z.array(z.string()).max(8),
  followUpQuestions: z.array(z.string()).min(1).max(6),
  riskSignals: z.array(z.string()).max(6),
});

export const POST = withApiRoute({
  routeId: "ai.claim-intake",
  featureFlag: "ai_v1",
  handler: async (request) => {
    const rateKey = `ai-claim-intake:${request.headers.get("x-forwarded-for") ?? "unknown"}`;
    const rateLimit = consumeRateLimit(rateKey, 20, 60 * 1000);

    if (!rateLimit.allowed) {
      return tooManyRequests("Rate limit exceeded for claim intake assistant");
    }

    const payload = await request.json().catch(() => null);
    const parsed = claimIntakeRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    try {
      const extraction = await runStructuredAI({
        schema: claimIntakeOutputSchema,
        system:
          "You are TrustFlow's claim intake assistant. Return concise, plain-language outputs for insurance staff and customers.",
        prompt: [
          "Extract structured claim intake data from the narrative below.",
          "Prefer factual, auditable wording.",
          parsed.data.policyContext
            ? `Policy context: ${JSON.stringify(parsed.data.policyContext)}`
            : "Policy context: unavailable",
          `Narrative: ${parsed.data.claimText}`,
        ].join("\n\n"),
      });

      return success({
        extraction,
        audit: {
          redactedInputPreview: redactSensitiveText(
            parsed.data.claimText,
          ).slice(0, 220),
        },
      });
    } catch {
      return internalError(
        "Claim intake assistant failed to generate a result",
      );
    }
  },
});
