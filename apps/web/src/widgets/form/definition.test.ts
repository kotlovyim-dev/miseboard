import { describe, expect, it } from "vitest";
import { formDefinition } from "./definition";

describe("formDefinition.templatedFields", () => {
  it("lists the default and options templates of each field", () => {
    const props = {
      ...formDefinition.defaultProps("form1", { queryIds: [] }),
      fields: [
        { name: "item", label: "Item", type: "select" as const, options: "{{ items.data }}" },
        { name: "delta", label: "Change", type: "number" as const, default: "{{ 5 }}" },
        { name: "note", label: "Note", type: "text" as const },
      ],
    };

    expect(formDefinition.templatedFields(props)).toEqual({
      "fields.item.options": "{{ items.data }}",
      "fields.delta.default": "{{ 5 }}",
    });
  });
});
