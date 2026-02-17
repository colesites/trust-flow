const NON_ALPHANUMERIC = /[^a-z0-9_-]/gi;

function sanitizeForOrganizationId(value: string) {
  return value.toLowerCase().replaceAll(NON_ALPHANUMERIC, "_");
}

export function defaultOrganizationIdForUser(userId: string) {
  return `org_${sanitizeForOrganizationId(userId)}`;
}

export function resolveOrganizationId(
  organizationId: string | null | undefined,
  userId: string,
) {
  if (organizationId && organizationId.trim().length > 0) {
    return organizationId;
  }

  return defaultOrganizationIdForUser(userId);
}
