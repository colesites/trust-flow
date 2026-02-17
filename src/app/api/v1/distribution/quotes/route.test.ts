import { describe, expect, it } from "bun:test";

import { GET, POST } from "@/app/api/v1/distribution/quotes/route";

process.env.TRUSTFLOW_TEST_AUTH = "enabled";

const authHeaders = {
  "content-type": "application/json",
  "x-test-user-id": "customer-quote-1",
  "x-test-role": "customer",
  "x-test-org-id": "org-test-distribution",
};

describe("distribution quotes route", () => {
  it("creates and lists quotes", async () => {
    const createResponse = await POST(
      new Request("http://localhost/api/v1/distribution/quotes", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          productCode: "HOME_STANDARD",
          coverageAmount: 250000,
          premiumCents: 14500,
          currency: "USD",
        }),
      }),
    );

    expect(createResponse.status).toBe(201);

    const listResponse = await GET(
      new Request("http://localhost/api/v1/distribution/quotes?limit=10", {
        headers: authHeaders,
      }),
    );

    expect(listResponse.status).toBe(200);

    const payload = await listResponse.json();
    expect(payload.ok).toBe(true);
    expect(payload.data.items.length).toBeGreaterThan(0);
  });
});
