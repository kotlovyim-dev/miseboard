import { describe, expect, it } from "vitest";
import { listVariableNames } from "./list-variable-names";

describe("listVariableNames", () => {
  it("lists the variables an operation declares", () => {
    const source = "query Orders($venueId: ID!, $first: Int) { orders { id } }";

    expect(listVariableNames(source)).toEqual(["venueId", "first"]);
  });

  it("returns nothing for a document that does not parse", () => {
    expect(listVariableNames("query ($venueId: ")).toEqual([]);
  });
});
