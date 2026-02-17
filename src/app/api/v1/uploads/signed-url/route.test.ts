import { describe, expect, it } from "bun:test";

import { POST } from "@/app/api/v1/uploads/signed-url/route";

process.env.TRUSTFLOW_TEST_AUTH = "enabled";

const headers = {
  "content-type": "application/json",
  "x-test-user-id": "customer-upload-1",
  "x-test-role": "customer",
  "x-test-org-id": "org-test-uploads",
};

describe("signed upload url route", () => {
  it("creates a signed upload payload", async () => {
    const response = await POST(
      new Request("http://localhost/api/v1/uploads/signed-url", {
        method: "POST",
        headers,
        body: JSON.stringify({
          entityType: "kyc",
          fileName: "passport-front.png",
          contentType: "image/png",
          checksum: "sha256-1234567890abcdef",
        }),
      }),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();

    expect(payload.ok).toBe(true);
    expect(String(payload.data.uploadURL)).toContain(
      "https://storage.trustflow.local/upload/",
    );
  });

  it("rejects unsupported content type", async () => {
    const response = await POST(
      new Request("http://localhost/api/v1/uploads/signed-url", {
        method: "POST",
        headers,
        body: JSON.stringify({
          entityType: "claim",
          fileName: "evidence.exe",
          contentType: "application/octet-stream",
          checksum: "sha256-abcdef0123456789",
        }),
      }),
    );

    expect(response.status).toBe(400);
  });
});
