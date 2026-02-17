import { describe, expect, it } from "bun:test";

import { POST as captureDecision } from "@/app/api/v1/underwriting/cases/decision/route";
import { POST as createCase } from "@/app/api/v1/underwriting/cases/route";

process.env.TRUSTFLOW_TEST_AUTH = "enabled";

const underwriterHeaders = {
  "content-type": "application/json",
  "x-test-user-id": "underwriter-decision-1",
  "x-test-role": "underwriter",
  "x-test-org-id": "org-test-underwriting-decision",
};

describe("underwriting decision route", () => {
  it("captures a decision for an existing case", async () => {
    const createResponse = await createCase(
      new Request("http://localhost/api/v1/underwriting/cases", {
        method: "POST",
        headers: underwriterHeaders,
        body: JSON.stringify({
          productCode: "AUTO_PLUS",
          riskScore: 63,
          summary: "Prior weather claims require manual scrutiny.",
        }),
      }),
    );

    expect(createResponse.status).toBe(201);
    const createPayload = await createResponse.json();
    const caseId = String(createPayload.data.id);

    const decisionResponse = await captureDecision(
      new Request("http://localhost/api/v1/underwriting/cases/decision", {
        method: "POST",
        headers: underwriterHeaders,
        body: JSON.stringify({
          caseId,
          decision: "refer",
          notes: "Escalate to regional underwriting panel",
        }),
      }),
    );

    expect(decisionResponse.status).toBe(200);
    const decisionPayload = await decisionResponse.json();

    expect(decisionPayload.ok).toBe(true);
    expect(decisionPayload.data.status).toBe("referred");
  });
});
