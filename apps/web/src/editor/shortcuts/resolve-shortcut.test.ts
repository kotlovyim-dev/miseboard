import { describe, expect, it } from "vitest";
import { resolveShortcut } from "./resolve-shortcut";

const press = (key: string, modifier: "ctrlKey" | "metaKey" | null = null, shiftKey = false) => ({
  key,
  metaKey: modifier === "metaKey",
  ctrlKey: modifier === "ctrlKey",
  shiftKey,
});

describe("resolveShortcut", () => {
  it("maps the modifier combinations to actions", () => {
    expect(resolveShortcut(press("k", "metaKey"), false)).toBe("togglePalette");
    expect(resolveShortcut(press("d", "ctrlKey"), false)).toBe("duplicate");
    expect(resolveShortcut(press("?"), false)).toBe("showHelp");
    expect(resolveShortcut(press("z", "metaKey"), false)).toBe("undo");
    expect(resolveShortcut(press("Z", "ctrlKey", true), false)).toBe("redo");
  });

  it("keeps the palette shortcut while typing but not the others", () => {
    expect(resolveShortcut(press("k", "ctrlKey"), true)).toBe("togglePalette");
    expect(resolveShortcut(press("d", "ctrlKey"), true)).toBeNull();
    expect(resolveShortcut(press("?"), true)).toBeNull();
    expect(resolveShortcut(press("z", "ctrlKey"), true)).toBeNull();
  });

  it("ignores plain letters", () => {
    expect(resolveShortcut(press("d"), false)).toBeNull();
    expect(resolveShortcut(press("k"), false)).toBeNull();
  });
});
