import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TextWidget } from "./text-widget";

function render(content: unknown) {
  return renderToStaticMarkup(
    createElement(TextWidget, { id: "notes", props: { content }, state: {}, setState: vi.fn() }),
  );
}

describe("TextWidget", () => {
  it("renders markdown", () => {
    expect(render("**bold**")).toContain("<strong>bold</strong>");
  });

  it("drops raw html", () => {
    expect(render("hi <script>alert(1)</script><b>x</b>")).not.toMatch(/<script|<b>/);
  });
});
