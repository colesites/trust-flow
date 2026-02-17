import { describe, expect, it } from "bun:test";

import { hasPermission } from "@/lib/auth/rbac";

describe("rbac permissions", () => {
  it("grants customer claim creation", () => {
    expect(hasPermission("customer", "claims:create")).toBe(true);
  });

  it("blocks customer underwriting decision", () => {
    expect(hasPermission("customer", "underwriting:decide")).toBe(false);
  });

  it("grants admin all critical permissions", () => {
    expect(hasPermission("admin", "admin:manage")).toBe(true);
    expect(hasPermission("admin", "claims:approve")).toBe(true);
  });
});
