import type { AppRole } from "@/lib/auth/roles";

export const PERMISSIONS = [
  "claims:create",
  "claims:view",
  "claims:update",
  "claims:approve",
  "underwriting:view",
  "underwriting:decide",
  "distribution:view",
  "distribution:quote",
  "admin:manage",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const rolePermissions: Record<AppRole, Set<Permission>> = {
  customer: new Set([
    "claims:create",
    "claims:view",
    "distribution:view",
    "distribution:quote",
  ]),
  agent: new Set([
    "claims:create",
    "claims:view",
    "claims:update",
    "distribution:view",
    "distribution:quote",
  ]),
  adjuster: new Set(["claims:view", "claims:update", "claims:approve"]),
  underwriter: new Set([
    "underwriting:view",
    "underwriting:decide",
    "distribution:view",
  ]),
  admin: new Set(PERMISSIONS),
  super_admin: new Set(PERMISSIONS),
};

export function hasPermission(role: AppRole, permission: Permission) {
  return rolePermissions[role].has(permission);
}
