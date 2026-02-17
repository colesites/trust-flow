import {
  createQuote,
  listQuotes,
} from "@/domains/distribution/quote.repository";
import {
  quoteCreateSchema,
  quoteListSchema,
} from "@/domains/distribution/quote.schemas";
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
  routeId: "v1.distribution.quotes.list",
  featureFlag: "distribution_v1",
  handler: async (request) => {
    const authz = await authorizeRequest(request, "distribution:view");

    if (authz.response) {
      return authz.response;
    }

    const searchParams = new URL(request.url).searchParams;
    const parsedQuery = quoteListSchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsedQuery.success) {
      return validationError(parsedQuery.error);
    }

    const items = listQuotes(authz.context.organizationId, parsedQuery.data);

    return success({
      items,
      total: items.length,
    });
  },
});

export const POST = withApiRoute({
  routeId: "v1.distribution.quotes.create",
  featureFlag: "distribution_v1",
  handler: async (request) => {
    const authz = await authorizeRequest(request, "distribution:quote");

    if (authz.response) {
      return authz.response;
    }

    const payload = await request.json().catch(() => null);

    if (!payload) {
      return badRequest("Request body must be valid JSON");
    }

    const parsed = quoteCreateSchema.safeParse(payload);

    if (!parsed.success) {
      return validationError(parsed.error);
    }

    const record = createQuote(
      authz.context.organizationId,
      authz.context.userId,
      parsed.data,
    );

    safeRevalidateTag(`dashboard:${authz.context.organizationId}`, "max");

    return created(record);
  },
});
