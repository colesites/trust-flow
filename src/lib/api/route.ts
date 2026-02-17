import { randomUUID } from "node:crypto";

import { internalError, notFound } from "@/lib/api/response";
import { env } from "@/lib/env";
import type { FeatureFlagKey } from "@/lib/feature-flags";
import { isFeatureEnabled } from "@/lib/feature-flags";

type RouteHandler = (request: Request) => Promise<Response> | Response;

type ApiRouteOptions = {
  routeId: string;
  featureFlag?: FeatureFlagKey;
  handler: RouteHandler;
};

function withHeaders(response: Response, headers: Record<string, string>) {
  const nextHeaders = new Headers(response.headers);

  for (const [key, value] of Object.entries(headers)) {
    nextHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: nextHeaders,
  });
}

function logRouteEvent(event: Record<string, unknown>) {
  if (env.TRUSTFLOW_OBSERVABILITY_LOGGING === "disabled") {
    return;
  }

  console.info(
    JSON.stringify({
      scope: "api",
      ...event,
    }),
  );
}

export function withApiRoute({
  routeId,
  featureFlag,
  handler,
}: ApiRouteOptions) {
  return async (request: Request) => {
    const requestId = request.headers.get("x-request-id") ?? randomUUID();
    const startedAt = Date.now();

    if (featureFlag && !isFeatureEnabled(featureFlag)) {
      const response = notFound(`Feature '${featureFlag}' is disabled`);

      logRouteEvent({
        routeId,
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        statusCode: response.status,
        latencyMs: Date.now() - startedAt,
        featureFlag,
      });

      return withHeaders(response, {
        "x-request-id": requestId,
      });
    }

    try {
      const response = await handler(request);
      const latencyMs = Date.now() - startedAt;

      logRouteEvent({
        routeId,
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        statusCode: response.status,
        latencyMs,
      });

      return withHeaders(response, {
        "x-request-id": requestId,
        "x-response-time-ms": String(latencyMs),
      });
    } catch (error) {
      const response = internalError();
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      logRouteEvent({
        routeId,
        requestId,
        method: request.method,
        path: new URL(request.url).pathname,
        statusCode: response.status,
        latencyMs: Date.now() - startedAt,
        error: errorMessage,
      });

      return withHeaders(response, {
        "x-request-id": requestId,
      });
    }
  };
}
