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
  customerMessage: z.string().min(10).max(4_000),
  threadSummary: z.string().max(2_000).optional(),
  claimStatus: z.string().max(64).optional(),
});

const outputSchema = z.object({
  draftReply: z.string(),
  tone: z.enum(["calm", "empathetic", "direct"]),
  nextActions: z.array(z.string()).max(5),
});

export const POST = withApiRoute({
  routeId: "ai.support-copilot",
  featureFlag: "ai_v1",
  handler: async (request) => {
    const rateKey = `ai-support:${request.headers.get("x-forwarded-for") ?? "unknown"}`;
    const rateLimit = consumeRateLimit(rateKey, 20, 60 * 1000);

    if (!rateLimit.allowed) {
      return tooManyRequests("Rate limit exceeded for support copilot");
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
          "You draft insurance support replies in plain, reassuring language. Never invent policy facts.",
        prompt: [
          "Draft a customer support response and next actions.",
          parsed.data.threadSummary
            ? `Thread summary: ${parsed.data.threadSummary}`
            : "Thread summary: unavailable",
          parsed.data.claimStatus
            ? `Claim status: ${parsed.data.claimStatus}`
            : "Claim status: unavailable",
          `Customer message: ${parsed.data.customerMessage}`,
        ].join("\n\n"),
      });

      return success({ extraction });
    } catch {
      return internalError("Support copilot failed to generate a result");
    }
  },
});
