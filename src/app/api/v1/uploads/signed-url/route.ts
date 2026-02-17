import { signedUploadRequestSchema } from "@/domains/kyc/kyc.schemas";
import { authorizeRequest } from "@/lib/api/authz";
import {
  badRequest,
  success,
  tooManyRequests,
  validationError,
} from "@/lib/api/response";
import { withApiRoute } from "@/lib/api/route";
import { consumeRateLimit } from "@/lib/security/rate-limit";
import { createSignedUploadURL } from "@/lib/storage/signed-url";

function getRateLimitKey(request: Request, userId: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return `upload:${userId}:${ip}`;
}

export const POST = withApiRoute({
  routeId: "v1.uploads.signed-url.create",
  featureFlag: "kyc_v1",
  handler: async (request) => {
    const authz = await authorizeRequest(request, "claims:create");

    if (authz.response) {
      return authz.response;
    }

    const rateLimit = consumeRateLimit(
      getRateLimitKey(request, authz.context.userId),
      15,
      60 * 1000,
    );

    if (!rateLimit.allowed) {
      return tooManyRequests("Rate limit exceeded for signed upload URLs");
    }

    const payload = await request.json().catch(() => null);

    if (!payload) {
      return badRequest("Request body must be valid JSON");
    }

    const parsed = signedUploadRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    try {
      const signedUpload = createSignedUploadURL(
        authz.context.organizationId,
        parsed.data,
      );
      return success(signedUpload);
    } catch (error) {
      return badRequest((error as Error).message);
    }
  },
});
