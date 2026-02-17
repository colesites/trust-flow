import { resolveOrganizationId } from "@/lib/auth/organization";
import type { AppRole } from "@/lib/auth/roles";
import { isAppRole } from "@/lib/auth/roles";
import { auth } from "@/lib/auth/server";

export type RequestAuthContext = {
  userId: string;
  role: AppRole;
  organizationId: string;
};

function getTestContext(request: Request): RequestAuthContext | null {
  if (process.env.TRUSTFLOW_TEST_AUTH !== "enabled") {
    return null;
  }

  const userId = request.headers.get("x-test-user-id");
  const roleHeader = request.headers.get("x-test-role");
  const organizationId = request.headers.get("x-test-org-id");

  if (!userId || !roleHeader || !isAppRole(roleHeader)) {
    return null;
  }

  return {
    userId,
    role: roleHeader,
    organizationId: resolveOrganizationId(organizationId, userId),
  };
}

export async function getRequestAuthContext(
  request: Request,
): Promise<RequestAuthContext | null> {
  const testContext = getTestContext(request);

  if (testContext) {
    return testContext;
  }

  const session = await auth.api
    .getSession({ headers: new Headers(request.headers) })
    .catch(() => null);

  if (!session?.user || !session?.session) {
    return null;
  }

  const userRecord = session.user as Record<string, unknown>;
  const rawRole = typeof userRecord.role === "string" ? userRecord.role : null;
  const rawOrganizationId =
    typeof userRecord.activeOrganizationId === "string"
      ? userRecord.activeOrganizationId
      : null;

  return {
    userId: session.user.id,
    role: isAppRole(rawRole) ? rawRole : "customer",
    organizationId: resolveOrganizationId(rawOrganizationId, session.user.id),
  };
}
