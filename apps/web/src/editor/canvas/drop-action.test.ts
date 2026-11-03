import { describe, expect, it } from "vitest";
import { CANVAS_DROPPABLE_ID, resolveDrop } from "./drop-action";

const ids = ["table1", "stat1", "text1"];

describe("resolveDrop", () => {
  it("moves a widget onto the position of the widget it is dropped on", () => {
    expect(resolveDrop(ids, "table1", "text1")).toEqual({ kind: "move", from: 0, to: 2 });
  });

  it("moves a widget to the end when dropped on empty canvas space", () => {
    expect(resolveDrop(ids, "table1", CANVAS_DROPPABLE_ID)).toEqual({
      kind: "move",
      from: 0,
      to: 2,
    });
  });

  it("ignores drops outside the canvas and onto itself", () => {
    expect(resolveDrop(ids, "table1", null)).toBeNull();
    expect(resolveDrop(ids, "stat1", "stat1")).toBeNull();
  });

  it("inserts a palette item before the widget it is dropped on", () => {
    expect(resolveDrop(ids, "palette-text", "stat1", "text")).toEqual({
      kind: "add",
      type: "text",
      index: 1,
    });
  });

  it("appends a palette item dropped on empty canvas space", () => {
    expect(resolveDrop(ids, "palette-stat", CANVAS_DROPPABLE_ID, "stat")).toEqual({
      kind: "add",
      type: "stat",
      index: 3,
    });
  });
});
