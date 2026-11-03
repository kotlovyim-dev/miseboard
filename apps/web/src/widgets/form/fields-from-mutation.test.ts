import { buildSchema } from "graphql";
import { describe, expect, it } from "vitest";
import { fieldsFromMutation } from "./fields-from-mutation";

const schema = buildSchema(`
  enum Reason { SPOILAGE RESTOCK }
  type Query { ok: Boolean }
  type Mutation { adjust(itemId: ID!, delta: Int!, reason: Reason, note: String): Boolean }
`);

describe("fieldsFromMutation", () => {
  it("maps scalars to text and number fields with readable labels", () => {
    const document =
      "mutation($itemId: ID!, $delta: Int!) { adjust(itemId: $itemId, delta: $delta) }";

    expect(fieldsFromMutation(schema, document)).toEqual([
      { name: "itemId", label: "Item id", type: "text" },
      { name: "delta", label: "Delta", type: "number" },
    ]);
  });

  it("turns an enum into a select listing its values", () => {
    const document = "mutation($reason: Reason) { adjust(itemId: 1, delta: 1, reason: $reason) }";

    expect(fieldsFromMutation(schema, document)).toEqual([
      { name: "reason", label: "Reason", type: "select", options: '{{ ["SPOILAGE","RESTOCK"] }}' },
    ]);
  });

  it("carries a variable default into the field", () => {
    const document = "mutation($delta: Int = 5) { adjust(itemId: 1, delta: $delta) }";

    expect(fieldsFromMutation(schema, document)[0]?.default).toBe("{{ 5 }}");
  });

  it("returns nothing for a document that does not parse", () => {
    expect(fieldsFromMutation(schema, "mutation($a: ")).toEqual([]);
  });
});
