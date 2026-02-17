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

export function normalizeAppRole(
  value: string | null | undefined,
): AppRole | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();

  return isAppRole(normalized) ? normalized : null;
}
