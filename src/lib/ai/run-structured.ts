import { gateway } from "@ai-sdk/gateway";
import { generateText, Output } from "ai";
import type { z } from "zod";

import { env } from "@/lib/env";

export async function runStructuredAI<TSchema extends z.ZodTypeAny>({
  schema,
  system,
  prompt,
}: {
  schema: TSchema;
  system: string;
  prompt: string;
}) {
  if (!env.AI_GATEWAY_MODEL) {
    throw new Error(
      "AI_GATEWAY_MODEL is not configured. Set a current gateway model ID in env.",
    );
  }

  const result = await generateText({
    model: gateway(env.AI_GATEWAY_MODEL),
    system,
    output: Output.object({ schema }),
    prompt,
  });

  return result.output as z.infer<TSchema>;
}
