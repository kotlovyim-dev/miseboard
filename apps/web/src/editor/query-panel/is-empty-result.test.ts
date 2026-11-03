import { describe, expect, it } from "vitest";
import { isEmptyResult } from "./is-empty-result";

describe("isEmptyResult", () => {
  it("treats null, empty lists and empty connections as empty", () => {
    expect(isEmptyResult({ orders: { edges: [] }, venue: null, items: [] })).toBe(true);
  });

  it("is not empty when any field has rows", () => {
    expect(isEmptyResult({ orders: { edges: [{ node: { id: "1" } }] }, venue: null })).toBe(false);
  });

  it("is not empty for a plain object value", () => {
    expect(isEmptyResult({ venue: { name: "Chaika Bistro" } })).toBe(false);
  });
});
