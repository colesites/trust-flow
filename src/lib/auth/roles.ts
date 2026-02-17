export const APP_ROLES = [
  "customer",
  "agent",
  "adjuster",
  "underwriter",
  "admin",
  "super_admin",
] as const;

export type AppRole = (typeof APP_ROLES)[number];

export function isAppRole(value: string | null | undefined): value is AppRole {
  if (!value) {
    return false;
  }

  return APP_ROLES.includes(value as AppRole);
}
