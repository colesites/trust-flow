import { describe, expect, it } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders with children", () => {
    const html = renderToStaticMarkup(<Button>Continue</Button>);
    expect(html.includes("Continue")).toBe(true);
  });

  it("renders semantic button element", () => {
    const html = renderToStaticMarkup(
      <Button variant="secondary">Save</Button>,
    );
    expect(html.startsWith("<button")).toBe(true);
  });
});
