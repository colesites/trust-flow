import { describe, expect, it } from "bun:test";

import {
  applyUnderwritingDecision,
  createUnderwritingCase,
  listUnderwritingCases,
} from "@/domains/underwriting/underwriting.repository";

describe("underwriting repository", () => {
  it("creates and lists cases", () => {
    const created = createUnderwritingCase("org-test", "user-1", {
      productCode: "AUTO_PREMIUM",
      riskScore: 41,
      summary:
        "Customer has stable credit and no major claims in the last 5 years.",
    });

    const listed = listUnderwritingCases("org-test", { limit: 20 });

    expect(listed.some((item) => item.id === created.id)).toBe(true);
  });

  it("applies a decision", () => {
    const created = createUnderwritingCase("org-test-2", "user-2", {
      productCode: "HOME_STANDARD",
      riskScore: 62,
      summary: "Property is in a flood zone with prior weather incidents.",
    });

    const decided = applyUnderwritingDecision(
      {
        caseId: created.id,
        decision: "refer",
        notes: "Escalate for manual regional review",
      },
      "underwriter-1",
    );

    expect(decided.status).toBe("referred");
  });
});
