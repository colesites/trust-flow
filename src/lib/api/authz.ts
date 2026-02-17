import { forbidden, unauthorized } from "@/lib/api/response";
import { hasPermission, type Permission } from "@/lib/auth/rbac";
import {
  getRequestAuthContext,
  type RequestAuthContext,
} from "@/lib/auth/request-context";

export type AuthorizationResult =
  | { context: RequestAuthContext; response: null }
  | { context: null; response: Response };

export async function authorizeRequest(
  request: Request,
  permission: Permission,
): Promise<AuthorizationResult> {
  const context = await getRequestAuthContext(request);

  if (!context) {
    return { context: null, response: unauthorized() };
  }

  if (!hasPermission(context.role, permission)) {
    return { context: null, response: forbidden() };
  }

  return { context, response: null };
}
