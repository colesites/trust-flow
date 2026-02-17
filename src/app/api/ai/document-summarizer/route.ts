import { z } from "zod";
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

const requestSchema = z.object({
  documentText: z.string().min(60).max(20_000),
  context: z.string().max(1_000).optional(),
});

const outputSchema = z.object({
  summary: z.string(),
  keyFacts: z.array(z.string()).max(10),
  riskNotes: z.array(z.string()).max(6),
});

export const POST = withApiRoute({
  routeId: "ai.document-summarizer",
  featureFlag: "ai_v1",
  handler: async (request) => {
    const rateKey = `ai-doc-summary:${request.headers.get("x-forwarded-for") ?? "unknown"}`;
    const rateLimit = consumeRateLimit(rateKey, 20, 60 * 1000);

    if (!rateLimit.allowed) {
      return tooManyRequests("Rate limit exceeded for document summarization");
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
          "You summarize insurance evidence into clear bullet-ready facts for adjusters. Avoid legal advice.",
        prompt: [
          "Summarize this customer document for claim review.",
          parsed.data.context
            ? `Context: ${parsed.data.context}`
            : "Context: unavailable",
          `Document: ${parsed.data.documentText}`,
        ].join("\n\n"),
      });

      return success({
        extraction,
        audit: {
          redactedInputPreview: redactSensitiveText(
            parsed.data.documentText,
          ).slice(0, 240),
        },
      });
    } catch {
      return internalError("Document summarizer failed to generate a result");
    }
  },
});
