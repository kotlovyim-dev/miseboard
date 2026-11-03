import { describe, expect, it } from "vitest";
import { describeVariables } from "./describe-variables";

describe("describeVariables", () => {
  it("lists each variable as name = value", () => {
    expect(describeVariables({ venueId: "v1", first: 20 })).toBe("venueId = v1, first = 20");
  });

  it("is empty when there are no variables", () => {
    expect(describeVariables({})).toBe("");
  });
});
