import { z } from "zod";

import { runStructuredAI } from "@/lib/ai/run-structured";
import {
  internalError,
  success,
  tooManyRequests,
  validationError,
} from "@/lib/api/response";
import { withApiRoute } from "@/lib/api/route";
import { consumeRateLimit } from "@/lib/security/rate-limit";

const requestSchema = z.object({
  caseSummary: z.string().min(30).max(8_000),
  riskSignals: z.array(z.string()).max(20),
  pricingFactors: z.array(z.string()).max(20),
});

const outputSchema = z.object({
  plainEnglishExplanation: z.string(),
  topDrivers: z.array(z.string()).max(6),
  recommendation: z.enum(["approve", "decline", "refer"]),
  cautionNotes: z.array(z.string()).max(5),
});

export const POST = withApiRoute({
  routeId: "ai.underwriting-insight",
  featureFlag: "ai_v1",
  handler: async (request) => {
    const rateKey = `ai-underwriting:${request.headers.get("x-forwarded-for") ?? "unknown"}`;
    const rateLimit = consumeRateLimit(rateKey, 20, 60 * 1000);

    if (!rateLimit.allowed) {
      return tooManyRequests("Rate limit exceeded for underwriting insights");
    }

    const payload = await request.json().catch(() => null);
    const parsed = requestSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    try {
      const extraction = await runStructuredAI({
        schema: outputSchema,
        system:
          "You explain underwriting outcomes in plain language for internal teams without exposing confidential model internals.",
        prompt: [
          "Explain the case with transparent, concise rationale.",
          `Case summary: ${parsed.data.caseSummary}`,
          `Risk signals: ${parsed.data.riskSignals.join("; ") || "none"}`,
          `Pricing factors: ${parsed.data.pricingFactors.join("; ") || "none"}`,
        ].join("\n\n"),
      });

      return success({ extraction });
    } catch {
      return internalError(
        "Underwriting insight helper failed to generate a result",
      );
    }
  },
});
