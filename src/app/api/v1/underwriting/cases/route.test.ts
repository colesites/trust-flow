import { describe, expect, it } from "bun:test";

import { GET, POST } from "@/app/api/v1/underwriting/cases/route";

process.env.TRUSTFLOW_TEST_AUTH = "enabled";

function makeUnderwriterHeaders() {
  return {
    "content-type": "application/json",
    "x-test-user-id": "underwriter-test-1",
    "x-test-role": "underwriter",
    "x-test-org-id": "org-test-underwriting",
  };
}

describe("underwriting cases route", () => {
  it("creates and lists cases for authorized user", async () => {
    const createResponse = await POST(
      new Request("http://localhost/api/v1/underwriting/cases", {
        method: "POST",
        headers: makeUnderwriterHeaders(),
        body: JSON.stringify({
          productCode: "AUTO_PREMIUM",
          riskScore: 55,
          summary:
            "Recent policy migration with moderate weather exposure in region.",
        }),
      }),
    );

    expect(createResponse.status).toBe(201);

    const listResponse = await GET(
      new Request("http://localhost/api/v1/underwriting/cases?limit=10", {
        headers: makeUnderwriterHeaders(),
      }),
    );

    expect(listResponse.status).toBe(200);

    const payload = await listResponse.json();
    expect(payload.ok).toBe(true);
    expect(payload.data.items.length).toBeGreaterThan(0);
  });

  it("blocks customer access", async () => {
    const response = await GET(
      new Request("http://localhost/api/v1/underwriting/cases", {
        headers: {
          "x-test-user-id": "customer-1",
          "x-test-role": "customer",
          "x-test-org-id": "org-test-underwriting",
        },
      }),
    );

    expect(response.status).toBe(403);
  });
});
