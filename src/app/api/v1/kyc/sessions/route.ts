import { startKycVerificationSession } from "@/domains/kyc/kyc.repository";
import { verificationSessionStartSchema } from "@/domains/kyc/kyc.schemas";
import { authorizeRequest } from "@/lib/api/authz";
import {
  badRequest,
  created,
  tooManyRequests,
  validationError,
} from "@/lib/api/response";
import { withApiRoute } from "@/lib/api/route";
import { safeRevalidateTag } from "@/lib/cache/revalidate";
import { consumeRateLimit } from "@/lib/security/rate-limit";

function getRateLimitKey(request: Request, userId: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `kyc:${userId}:${ip}`;
}

export const POST = withApiRoute({
  routeId: "v1.kyc.sessions.create",
  featureFlag: "kyc_v1",
  handler: async (request) => {
    const authz = await authorizeRequest(request, "claims:create");

    if (authz.response) {
      return authz.response;
    }

    const rateLimit = consumeRateLimit(
      getRateLimitKey(request, authz.context.userId),
      10,
      60 * 1000,
    );

    if (!rateLimit.allowed) {
      return tooManyRequests("Rate limit exceeded for KYC session starts");
    }

    const payload = await request.json().catch(() => null);

    if (!payload) {
      return badRequest("Request body must be valid JSON");
    }

    const parsed = verificationSessionStartSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const record = startKycVerificationSession(
      authz.context.organizationId,
      authz.context.userId,
      parsed.data,
    );

    safeRevalidateTag(`dashboard:${authz.context.organizationId}`, "max");

    return created(record);
  },
});
