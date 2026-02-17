import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

import { env } from "@/lib/env";

function getTrustedOrigins() {
  const origins = new Set<string>();

  if (env.BETTER_AUTH_URL) {
    origins.add(env.BETTER_AUTH_URL);
  }

  if (env.NEXT_PUBLIC_APP_URL) {
    origins.add(env.NEXT_PUBLIC_APP_URL);
  }

  if (env.NODE_ENV !== "production") {
    for (let port = 3000; port <= 3010; port += 1) {
      origins.add(`http://localhost:${port}`);
      origins.add(`http://127.0.0.1:${port}`);
    }
  }

  return [...origins];
}

export const auth = betterAuth({
  appName: "TrustFlow",
  baseURL:
    env.BETTER_AUTH_URL ?? env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: getTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      activeOrganizationId: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 60,
  },
  advanced: {
    useSecureCookies: env.NODE_ENV === "production",
  },
  plugins: [nextCookies()],
});
