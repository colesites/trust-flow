import { triggerPayout } from "@/domains/payouts/payout.repository";
import { payoutTriggerSchema } from "@/domains/payouts/payout.schemas";
import { authorizeRequest } from "@/lib/api/authz";
import { badRequest, created, validationError } from "@/lib/api/response";
import { withApiRoute } from "@/lib/api/route";
import { safeRevalidateTag } from "@/lib/cache/revalidate";

export const POST = withApiRoute({
  routeId: "v1.payouts.create",
  featureFlag: "payouts_v1",
  handler: async (request) => {
    const authz = await authorizeRequest(request, "claims:approve");

    if (authz.response) {
      return authz.response;
    }

    const idempotencyKey = request.headers.get("idempotency-key");

    if (!idempotencyKey || idempotencyKey.length < 8) {
      return badRequest("idempotency-key header is required");
    }

    const payload = await request.json().catch(() => null);

    if (!payload) {
      return badRequest("Request body must be valid JSON");
    }

    const parsed = payoutTriggerSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const payout = triggerPayout(
      authz.context.organizationId,
      idempotencyKey,
      authz.context.userId,
      parsed.data,
    );

    safeRevalidateTag(`dashboard:${authz.context.organizationId}`, "max");

    return created(payout);
  },
});
