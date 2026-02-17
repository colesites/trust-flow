import { randomUUID } from "node:crypto";

import type { SignedUploadRequestInput } from "@/domains/kyc/kyc.schemas";

const allowedContentTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
  "image/webp",
]);

export type SignedUploadPayload = {
  key: string;
  uploadURL: string;
  expiresAt: string;
  method: "PUT";
  headers: {
    "content-type": string;
    "x-checksum": string;
  };
};

export function createSignedUploadURL(
  organizationId: string,
  input: SignedUploadRequestInput,
): SignedUploadPayload {
  if (!allowedContentTypes.has(input.contentType)) {
    throw new Error("Unsupported file content type");
  }

  const id = randomUUID();
  const key = `${organizationId}/${input.entityType}/${id}-${input.fileName}`;
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10).toISOString();

  return {
    key,
    uploadURL: `https://storage.trustflow.local/upload/${encodeURIComponent(key)}?expires=${encodeURIComponent(expiresAt)}`,
    expiresAt,
    method: "PUT",
    headers: {
      "content-type": input.contentType,
      "x-checksum": input.checksum,
    },
  };
}
