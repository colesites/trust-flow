import { describe, expect, it } from "bun:test";

import { GET, POST } from "@/app/api/v1/claims/route";

process.env.TRUSTFLOW_TEST_AUTH = "enabled";

function makeAuthHeaders(role: "customer" | "admin" = "customer") {
  return {
    "content-type": "application/json",
    "x-test-user-id": "user-test-1",
    "x-test-role": role,
    "x-test-org-id": "org-test-claims",
  };
}

describe("claims route", () => {
  it("rejects unauthenticated requests", async () => {
    const response = await GET(new Request("http://localhost/api/v1/claims"));
    expect(response.status).toBe(401);
  });

  it("creates and lists claims for authenticated customer", async () => {
    const createResponse = await POST(
      new Request("http://localhost/api/v1/claims", {
        method: "POST",
        headers: makeAuthHeaders(),
        body: JSON.stringify({
          policyId: "POL-001",
          claimType: "collision",
          incidentDate: "2026-02-15",
          description:
            "Rear-end collision on I-80 during stop-and-go traffic. Bumper damage and tail light breakage.",
        }),
      }),
    );

    expect(createResponse.status).toBe(201);
    expect(createResponse.headers.get("x-request-id")).toBeTruthy();

    const listResponse = await GET(
      new Request("http://localhost/api/v1/claims?limit=10", {
        headers: makeAuthHeaders(),
      }),
    );

    expect(listResponse.status).toBe(200);
    expect(listResponse.headers.get("x-request-id")).toBeTruthy();

    const payload = await listResponse.json();
    expect(payload.ok).toBe(true);
    expect(payload.data.items.length).toBeGreaterThan(0);
  });
});
