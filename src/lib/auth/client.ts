"use client";

import { createAuthClient } from "better-auth/react";

function normalizeBaseOrigin(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const origin = new URL(value).origin;
    return origin;
  } catch {
    return undefined;
  }
}

function resolveClientBaseURL() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/api/auth`;
  }

  const envOrigin = normalizeBaseOrigin(process.env.NEXT_PUBLIC_APP_URL);

  if (envOrigin) {
    return `${envOrigin}/api/auth`;
  }

  return undefined;
}

const baseURL = resolveClientBaseURL();

export const authClient = createAuthClient({
  ...(baseURL ? { baseURL } : {}),
});
