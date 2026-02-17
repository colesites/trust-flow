import { describe, expect, it } from "bun:test";

import { POST } from "@/app/api/v1/payouts/route";

process.env.TRUSTFLOW_TEST_AUTH = "enabled";

const baseHeaders = {
  "content-type": "application/json",
  "x-test-user-id": "adjuster-1",
  "x-test-role": "adjuster",
  "x-test-org-id": "org-test-payouts",
};

describe("payout route", () => {
  it("applies idempotency key", async () => {
    const body = JSON.stringify({
      claimId: "claim-test-001",
      amountCents: 120000,
      currency: "USD",
    });

    const first = await POST(
      new Request("http://localhost/api/v1/payouts", {
        method: "POST",
        headers: {
          ...baseHeaders,
          "idempotency-key": "idem-payout-001",
        },
        body,
      }),
    );

    const second = await POST(
      new Request("http://localhost/api/v1/payouts", {
        method: "POST",
        headers: {
          ...baseHeaders,
          "idempotency-key": "idem-payout-001",
        },
        body,
      }),
    );

    expect(first.status).toBe(201);
    expect(second.status).toBe(201);

    const firstPayload = await first.json();
    const secondPayload = await second.json();

    expect(firstPayload.data.id).toBe(secondPayload.data.id);
  });
});
