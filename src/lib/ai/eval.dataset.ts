import type { ClaimExtractionGoldCase } from "@/lib/ai/eval";

export const claimExtractionGoldDataset: ClaimExtractionGoldCase[] = [
  {
    id: "gold-collision-001",
    expected: {
      claimType: "collision",
      requiredDocuments: ["photo evidence", "repair estimate", "policy number"],
      followUpQuestions: [
        "Where did the collision happen?",
        "Was another driver involved?",
      ],
    },
    actual: {
      claimType: "collision",
      requiredDocuments: ["photo evidence", "repair estimate", "policy number"],
      followUpQuestions: [
        "Where did the collision happen?",
        "Was another driver involved?",
      ],
    },
  },
];
