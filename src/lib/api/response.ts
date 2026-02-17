import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export type ApiErrorCode =
  | "bad_request"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "validation_error"
  | "rate_limited"
  | "internal_error";

export type ApiSuccess<T> = {
  ok: true;
  data: T;
};

export type ApiFailure = {
  ok: false;
  error: {
    code: ApiErrorCode;
    message: string;
    details?: unknown;
  };
};

export function success<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ ok: true, data }, init);
}

export function created<T>(data: T) {
  return success(data, { status: 201 });
}

export function failure(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json<ApiFailure>(
    {
      ok: false,
      error: { code, message, details },
    },
    { status },
  );
}

export function validationError(error: ZodError) {
  return failure("validation_error", "Request validation failed", 422, {
    fieldErrors: error.flatten().fieldErrors,
    formErrors: error.flatten().formErrors,
  });
}

export function badRequest(message: string, details?: unknown) {
  return failure("bad_request", message, 400, details);
}

export function unauthorized(message = "Authentication required") {
  return failure("unauthorized", message, 401);
}

export function forbidden(
  message = "You do not have permission for this action",
) {
  return failure("forbidden", message, 403);
}

export function notFound(message = "Resource not found") {
  return failure("not_found", message, 404);
}

export function tooManyRequests(message = "Rate limit exceeded") {
  return failure("rate_limited", message, 429);
}

export function internalError(message = "Unexpected server error") {
  return failure("internal_error", message, 500);
}
