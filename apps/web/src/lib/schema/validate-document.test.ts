import { buildSchema } from "graphql";
import { describe, expect, it } from "vitest";
import { validateDocument } from "./validate-document";

const schema = buildSchema(`
  type Order { id: ID! total: Int! }
  type Query { orders(venueId: ID!): [Order!]! }
`);

describe("validateDocument", () => {
  it("accepts a valid query", () => {
    const source = "query Orders($venueId: ID!) { orders(venueId: $venueId) { id total } }";

    expect(validateDocument(source, schema)).toEqual([]);
  });

  it("reports an unknown field with its line", () => {
    const source = "query {\n  orders(venueId: 1) {\n    idd\n  }\n}";

    expect(validateDocument(source, schema)).toEqual([
      { line: 3, message: 'Cannot query field "idd" on type "Order". Did you mean "id"?' },
    ]);
  });

  it("reports a syntax error without a schema", () => {
    const [issue] = validateDocument("query { orders ", undefined);

    expect(issue).toMatchObject({ line: 1, message: expect.stringContaining("Syntax Error") });
  });

  it("does not check fields while the schema is missing", () => {
    expect(validateDocument("query { nope }")).toEqual([]);
  });
});
