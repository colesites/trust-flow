import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters long"),
  BETTER_AUTH_URL: z.string().url().optional(),
  DATABASE_URL: z.string().url().optional(),
  AI_GATEWAY_API_KEY: z.string().optional(),
  AI_GATEWAY_MODEL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  TRUSTFLOW_TEST_AUTH: z.enum(["enabled", "disabled"]).optional(),
  TRUSTFLOW_FEATURE_FLAGS: z.string().optional(),
  TRUSTFLOW_OBSERVABILITY_LOGGING: z.enum(["enabled", "disabled"]).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const formatted = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment variables:\n${formatted}`);
}

export const env = parsed.data;
