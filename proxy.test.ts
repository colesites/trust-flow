import { describe, expect, it } from "bun:test";
import { NextRequest } from "next/server";

import { proxy } from "./proxy";

describe("proxy auth guard", () => {
  it("redirects unauthenticated dashboard requests", () => {
    const request = new NextRequest("http://localhost/dashboard");
    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain(
      "/sign-in?next=%2Fdashboard",
    );
  });

  it("allows authenticated dashboard requests", () => {
    const request = new NextRequest("http://localhost/dashboard", {
      headers: {
        cookie: "better-auth.session_token=token",
      },
    });
    const response = proxy(request);

    expect(response.status).toBe(200);
    expect(response.headers.get("location")).toBeNull();
  });
});
