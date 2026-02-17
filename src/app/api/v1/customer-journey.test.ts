import { describe, expect, it } from "bun:test";

import { POST as claimCreate } from "@/app/api/v1/claims/route";
import { POST as quoteCreate } from "@/app/api/v1/distribution/quotes/route";
import { POST as kycStart } from "@/app/api/v1/kyc/sessions/route";
import { POST as payoutTrigger } from "@/app/api/v1/payouts/route";
import { POST as underwritingDecision } from "@/app/api/v1/underwriting/cases/decision/route";
import { POST as underwritingCreate } from "@/app/api/v1/underwriting/cases/route";
import { POST as signedUpload } from "@/app/api/v1/uploads/signed-url/route";

process.env.TRUSTFLOW_TEST_AUTH = "enabled";

const orgId = "org-journey-test";

function makeHeaders(role: string, userId: string) {
  return {
    "content-type": "application/json",
    "x-test-role": role,
    "x-test-user-id": userId,
    "x-test-org-id": orgId,
  };
}

describe("customer journey integration", () => {
  it("runs claim, underwriting, distribution, kyc, upload, and payout flow", async () => {
    const claimResponse = await claimCreate(
      new Request("http://localhost/api/v1/claims", {
        method: "POST",
        headers: makeHeaders("customer", "journey-customer-1"),
        body: JSON.stringify({
          policyId: "POL-JOURNEY-1",
          claimType: "collision",
          incidentDate: "2026-02-15",
          description:
            "Vehicle collision at an intersection with visible bumper and headlight damage.",
        }),
      }),
    );
    expect(claimResponse.status).toBe(201);
    const claimPayload = await claimResponse.json();
    const claimId = String(claimPayload.data.id);

    const quoteResponse = await quoteCreate(
      new Request("http://localhost/api/v1/distribution/quotes", {
        method: "POST",
        headers: makeHeaders("customer", "journey-customer-1"),
        body: JSON.stringify({
          productCode: "AUTO_PREMIUM",
          coverageAmount: 300000,
          premiumCents: 19900,
          currency: "USD",
        }),
      }),
    );
    expect(quoteResponse.status).toBe(201);

    const kycResponse = await kycStart(
      new Request("http://localhost/api/v1/kyc/sessions", {
        method: "POST",
        headers: makeHeaders("customer", "journey-customer-1"),
        body: JSON.stringify({
          provider: "api",
          documentType: "driver_license",
        }),
      }),
    );
    expect(kycResponse.status).toBe(201);

    const uploadResponse = await signedUpload(
      new Request("http://localhost/api/v1/uploads/signed-url", {
        method: "POST",
        headers: makeHeaders("customer", "journey-customer-1"),
        body: JSON.stringify({
          entityType: "claim",
          fileName: "vehicle-damage.png",
          contentType: "image/png",
          checksum: "sha256-journey-checksum-12345",
        }),
      }),
    );
    expect(uploadResponse.status).toBe(200);

    const underwritingCreateResponse = await underwritingCreate(
      new Request("http://localhost/api/v1/underwriting/cases", {
        method: "POST",
        headers: makeHeaders("underwriter", "journey-underwriter-1"),
        body: JSON.stringify({
          productCode: "AUTO_PREMIUM",
          riskScore: 57,
          summary: "Customer profile is stable with moderate exposure risk.",
        }),
      }),
    );
    expect(underwritingCreateResponse.status).toBe(201);
    const underwritingPayload = await underwritingCreateResponse.json();
    const caseId = String(underwritingPayload.data.id);

    const underwritingDecisionResponse = await underwritingDecision(
      new Request("http://localhost/api/v1/underwriting/cases/decision", {
        method: "POST",
        headers: makeHeaders("underwriter", "journey-underwriter-1"),
        body: JSON.stringify({
          caseId,
          decision: "refer",
          notes: "Escalate to manual review before final approval.",
        }),
      }),
    );
    expect(underwritingDecisionResponse.status).toBe(200);

    const payoutResponse = await payoutTrigger(
      new Request("http://localhost/api/v1/payouts", {
        method: "POST",
        headers: {
          ...makeHeaders("adjuster", "journey-adjuster-1"),
          "idempotency-key": "journey-payout-idem-001",
        },
        body: JSON.stringify({
          claimId,
          amountCents: 155000,
          currency: "USD",
        }),
      }),
    );
    expect(payoutResponse.status).toBe(201);
    const payoutPayload = await payoutResponse.json();

    expect(payoutPayload.ok).toBe(true);
    expect(payoutPayload.data.status).toBe("queued");
  });
});
