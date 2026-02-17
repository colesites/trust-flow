import { describe, expect, it } from "bun:test";

import {
  assertClaimTransition,
  canTransitionClaimStatus,
} from "@/domains/claims/claim-state";

describe("claim transitions", () => {
  it("allows valid transitions", () => {
    expect(canTransitionClaimStatus("submitted", "validating")).toBe(true);
    expect(canTransitionClaimStatus("in_review", "approved")).toBe(true);
    expect(canTransitionClaimStatus("approved", "paid")).toBe(true);
  });

  it("blocks invalid transitions", () => {
    expect(canTransitionClaimStatus("submitted", "paid")).toBe(false);
    expect(canTransitionClaimStatus("closed", "in_review")).toBe(false);
  });

  it("throws for invalid transitions", () => {
    expect(() => assertClaimTransition("submitted", "paid")).toThrow(
      "Invalid claim transition",
    );
  });
});
