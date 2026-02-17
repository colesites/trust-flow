import { describe, expect, it } from "bun:test";

import {
  type ClaimExtractionGoldCase,
  scoreClaimExtraction,
  summarizeClaimExtractionScores,
} from "@/lib/ai/eval";

const cases: ClaimExtractionGoldCase[] = [
  {
    id: "case-1",
    expected: {
      claimType: "collision",
      requiredDocuments: ["photo evidence", "police report"],
      followUpQuestions: ["where did the incident occur?"],
    },
    actual: {
      claimType: "collision",
      requiredDocuments: ["photo evidence", "repair estimate"],
      followUpQuestions: ["where did the incident occur?"],
    },
  },
  {
    id: "case-2",
    expected: {
      claimType: "weather",
      requiredDocuments: ["weather report", "damage photos"],
      followUpQuestions: ["when did damage start?", "was property secured?"],
    },
    actual: {
      claimType: "weather",
      requiredDocuments: ["weather report", "damage photos"],
      followUpQuestions: ["when did damage start?", "was property secured?"],
    },
  },
];

describe("claim extraction evaluation", () => {
  it("scores individual cases", () => {
    const score = scoreClaimExtraction(cases[0]);
    expect(score.score).toBeGreaterThan(0.5);
    expect(score.typeScore).toBe(1);
  });

  it("summarizes score distribution", () => {
    const summary = summarizeClaimExtractionScores(cases);
    expect(summary.count).toBe(2);
    expect(summary.meanScore).toBeGreaterThan(0.7);
    expect(summary.maxScore).toBeLessThanOrEqual(1);
  });
});
