import { describe, expect, it } from "bun:test";

import { POST } from "@/app/api/v1/kyc/sessions/route";

process.env.TRUSTFLOW_TEST_AUTH = "enabled";

const headers = {
  "content-type": "application/json",
  "x-test-user-id": "customer-kyc-1",
  "x-test-role": "customer",
  "x-test-org-id": "org-test-kyc",
};

describe("kyc sessions route", () => {
  it("starts a verification session", async () => {
    const response = await POST(
      new Request("http://localhost/api/v1/kyc/sessions", {
        method: "POST",
        headers,
        body: JSON.stringify({
          provider: "hosted",
          documentType: "passport",
        }),
      }),
    );

    expect(response.status).toBe(201);
    const payload = await response.json();

    expect(payload.ok).toBe(true);
    expect(payload.data.status).toBe("pending");
    expect(String(payload.data.expiresAt).length).toBeGreaterThan(10);
  });
});
