import { applyUnderwritingDecision } from "@/domains/underwriting/underwriting.repository";
import { underwritingDecisionSchema } from "@/domains/underwriting/underwriting.schemas";
import { authorizeRequest } from "@/lib/api/authz";
import { badRequest, success, validationError } from "@/lib/api/response";
import { withApiRoute } from "@/lib/api/route";
import { safeRevalidateTag } from "@/lib/cache/revalidate";

export const POST = withApiRoute({
  routeId: "v1.underwriting.cases.decision",
  featureFlag: "underwriting_v1",
  handler: async (request) => {
    const authz = await authorizeRequest(request, "underwriting:decide");

    if (authz.response) {
      return authz.response;
    }

    const payload = await request.json().catch(() => null);

    if (!payload) {
      return badRequest("Request body must be valid JSON");
    }

    const parsed = underwritingDecisionSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const updated = applyUnderwritingDecision(
      parsed.data,
      authz.context.userId,
    );
    safeRevalidateTag(`dashboard:${authz.context.organizationId}`, "max");

    return success(updated);
  },
});
