import { describe, expect, it } from "vitest";
import { readOptions } from "./select-options";

const venues = [
  { id: "v1", name: "Kashtan" },
  { id: "v2", name: "Dnipro" },
];

describe("readOptions", () => {
  it("maps records to label and value by key", () => {
    const props = { options: venues, labelKey: "name", valueKey: "id" };

    expect(readOptions("venueSelect", props)).toEqual([
      { label: "Kashtan", value: "v1" },
      { label: "Dnipro", value: "v2" },
    ]);
  });

  it("rejects options that are not an array", () => {
    const props = { options: null, labelKey: "name", valueKey: "id" };

    expect(() => readOptions("venueSelect", props)).toThrow("venueSelect.options must be an array");
  });

  it("rejects a missing key", () => {
    const props = { options: venues, labelKey: "name", valueKey: 3 };

    expect(() => readOptions("venueSelect", props)).toThrow("must be set");
  });
});
