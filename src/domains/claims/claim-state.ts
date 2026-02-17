import type { ClaimStatus } from "@/domains/claims/claim.types";

const transitionMap = new Map<ClaimStatus, ReadonlySet<ClaimStatus>>([
  ["draft", new Set(["submitted"])],
  ["submitted", new Set(["validating", "rejected"])],
  ["validating", new Set(["in_review", "rejected"])],
  ["in_review", new Set(["approved", "rejected"])],
  ["approved", new Set(["paid", "closed"])],
  ["rejected", new Set(["closed"])],
  ["paid", new Set(["closed"])],
  ["closed", new Set()],
]);

export function canTransitionClaimStatus(
  fromStatus: ClaimStatus,
  toStatus: ClaimStatus,
) {
  const allowed = transitionMap.get(fromStatus);
  return allowed ? allowed.has(toStatus) : false;
}

export function assertClaimTransition(
  fromStatus: ClaimStatus,
  toStatus: ClaimStatus,
) {
  if (fromStatus === toStatus) {
    return;
  }

  if (!canTransitionClaimStatus(fromStatus, toStatus)) {
    throw new Error(`Invalid claim transition: ${fromStatus} -> ${toStatus}`);
  }
}
