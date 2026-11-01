import { describe, expect, it } from "vitest";
import { parseTemplate } from "./template";

describe("parseTemplate", () => {
  it("keeps plain text as one text segment", () => {
    expect(parseTemplate("hello")).toEqual({
      ok: true,
      segments: [{ kind: "text", text: "hello" }],
      isSingleBlock: false,
    });
  });

  it("marks a value that is exactly one block as a single block", () => {
    expect(parseTemplate("{{ orders.data }}")).toEqual({
      ok: true,
      segments: [{ kind: "expression", source: " orders.data ", offset: 0 }],
      isSingleBlock: true,
    });
  });

  it("splits text and blocks and records each block offset", () => {
    expect(parseTemplate("Total: {{ a }} of {{ b }}!")).toEqual({
      ok: true,
      segments: [
        { kind: "text", text: "Total: " },
        { kind: "expression", source: " a ", offset: 7 },
        { kind: "text", text: " of " },
        { kind: "expression", source: " b ", offset: 18 },
        { kind: "text", text: "!" },
      ],
      isSingleBlock: false,
    });
  });

  it("does not treat a block with surrounding text as a single block", () => {
    const parsed = parseTemplate(" {{ a }}");

    expect(parsed).toMatchObject({ ok: true, isSingleBlock: false });
  });

  it("reports an unclosed block at the offset of its opening braces", () => {
    expect(parseTemplate("Hi {{ name")).toEqual({
      ok: false,
      error: "Unclosed {{ block",
      at: 3,
    });
  });
});
