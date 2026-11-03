import { describe, expect, it } from "vitest";
import { pickFreeSlug, slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and joins words with dashes", () => {
    expect(slugify("  Kitchen  Board! ")).toBe("kitchen-board");
  });

  it("falls back when no letters or digits remain", () => {
    expect(slugify("???")).toBe("app");
  });
});

describe("pickFreeSlug", () => {
  it("keeps the base when it is free", () => {
    expect(pickFreeSlug("board", ["board-2"])).toBe("board");
  });

  it("appends the first free number when the base is taken", () => {
    expect(pickFreeSlug("board", ["board", "board-2"])).toBe("board-3");
  });
});
