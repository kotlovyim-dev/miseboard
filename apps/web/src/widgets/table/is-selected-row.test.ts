import { describe, expect, it } from "vitest";
import { isSelectedRow } from "./is-selected-row";

describe("isSelectedRow", () => {
  it("matches a refetched row with the same id", () => {
    expect(isSelectedRow({ id: "o1", status: "NEW" }, { id: "o1", status: "READY" })).toBe(true);
  });

  it("does not match another id or an empty selection", () => {
    expect(isSelectedRow({ id: "o1" }, { id: "o2" })).toBe(false);
    expect(isSelectedRow(null, { id: "o1" })).toBe(false);
  });
});
