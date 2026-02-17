import {
  createUnderwritingCase,
  listUnderwritingCases,
} from "@/domains/underwriting/underwriting.repository";
import {
  underwritingCaseCreateSchema,
  underwritingCaseListSchema,
} from "@/domains/underwriting/underwriting.schemas";
import { authorizeRequest } from "@/lib/api/authz";
import {
  badRequest,
  created,
  success,
  validationError,
} from "@/lib/api/response";
import { withApiRoute } from "@/lib/api/route";
import { safeRevalidateTag } from "@/lib/cache/revalidate";

export const GET = withApiRoute({
  routeId: "v1.underwriting.cases.list",
  featureFlag: "underwriting_v1",
  handler: async (request) => {
    const authz = await authorizeRequest(request, "underwriting:view");

    if (authz.response) {
      return authz.response;
    }

    const searchParams = new URL(request.url).searchParams;
    const parsedQuery = underwritingCaseListSchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsedQuery.success) {
      return validationError(parsedQuery.error);
    }

    const items = listUnderwritingCases(
      authz.context.organizationId,
      parsedQuery.data,
    );

    return success({
      items,
      total: items.length,
    });
  },
});

export const POST = withApiRoute({
  routeId: "v1.underwriting.cases.create",
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

    const parsed = underwritingCaseCreateSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const record = createUnderwritingCase(
      authz.context.organizationId,
      authz.context.userId,
      parsed.data,
    );

    safeRevalidateTag(`dashboard:${authz.context.organizationId}`, "max");

    return created(record);
  },
});
