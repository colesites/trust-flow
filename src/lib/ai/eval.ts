export type ClaimExtraction = {
  claimType: string;
  requiredDocuments: string[];
  followUpQuestions: string[];
};

export type ClaimExtractionGoldCase = {
  id: string;
  expected: ClaimExtraction;
  actual: ClaimExtraction;
};

function scoreStringMatch(actual: string, expected: string) {
  return actual.trim().toLowerCase() === expected.trim().toLowerCase() ? 1 : 0;
}

function scoreArrayJaccard(actual: string[], expected: string[]) {
  const normalize = (value: string) => value.trim().toLowerCase();

  const actualSet = new Set(actual.map(normalize));
  const expectedSet = new Set(expected.map(normalize));

  const intersection = [...actualSet].filter((value) =>
    expectedSet.has(value),
  ).length;
  const union = new Set([...actualSet, ...expectedSet]).size;

  return union === 0 ? 1 : intersection / union;
}

export function scoreClaimExtraction(caseItem: ClaimExtractionGoldCase) {
  const typeScore = scoreStringMatch(
    caseItem.actual.claimType,
    caseItem.expected.claimType,
  );
  const docsScore = scoreArrayJaccard(
    caseItem.actual.requiredDocuments,
    caseItem.expected.requiredDocuments,
  );
  const followUpScore = scoreArrayJaccard(
    caseItem.actual.followUpQuestions,
    caseItem.expected.followUpQuestions,
  );

  const score = typeScore * 0.4 + docsScore * 0.35 + followUpScore * 0.25;

  return {
    id: caseItem.id,
    score,
    typeScore,
    docsScore,
    followUpScore,
  };
}

export function summarizeClaimExtractionScores(
  cases: ClaimExtractionGoldCase[],
) {
  if (cases.length === 0) {
    return {
      meanScore: 0,
      minScore: 0,
      maxScore: 0,
      count: 0,
    };
  }

  const scores = cases.map((caseItem) => scoreClaimExtraction(caseItem).score);
  const total = scores.reduce((sum, score) => sum + score, 0);

  return {
    meanScore: total / scores.length,
    minScore: Math.min(...scores),
    maxScore: Math.max(...scores),
    count: scores.length,
  };
}
