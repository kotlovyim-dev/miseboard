import { describe, expect, it } from "vitest";
import { resolveFields, seedDefaults, validateField } from "./form-fields";
import type { FormFieldConfig } from "./form-fields";

const fields: FormFieldConfig[] = [
  { name: "delta", label: "Change", type: "number", default: "{{ 5 }}" },
  { name: "note", label: "Note", type: "text", default: "{{ venue.name }}" },
  { name: "item", label: "Item", type: "select", options: '{{ ["a", "b"] }}' },
];

describe("resolveFields", () => {
  it("evaluates defaults and options against the scope", () => {
    const [delta, note, item] = resolveFields("form1", fields, { venue: { name: "Lviv" } });

    expect(delta?.defaultValue).toBe(5);
    expect(note?.defaultValue).toBe("Lviv");
    expect(item?.options).toEqual([
      { label: "a", value: "a" },
      { label: "b", value: "b" },
    ]);
  });

  it("names the field whose template cannot be parsed", () => {
    const broken: FormFieldConfig[] = [
      { name: "delta", label: "Change", type: "number", default: "{{ 1 + }}" },
    ];

    expect(() => resolveFields("form1", broken, {})).toThrow(/^form1\.fields\.delta: /);
  });
});

describe("seedDefaults", () => {
  const resolved = resolveFields("form1", fields, { venue: { name: "Lviv" } });

  it("fills only the fields that have no value yet", () => {
    expect(seedDefaults(resolved, { delta: 2 })).toEqual({ delta: 2, note: "Lviv" });
  });

  it("returns the same object when nothing is missing", () => {
    const values = { delta: 2, note: "" };

    expect(seedDefaults(resolved, values)).toBe(values);
  });
});

function resolveField(name: string) {
  const field = resolveFields("form1", fields, {}).find((candidate) => candidate.name === name);
  if (!field) throw new Error(`No field ${name}`);
  return field;
}

describe("validateField", () => {
  const delta = resolveField("delta");
  const note = resolveField("note");
  const item = resolveField("item");

  it("requires a number", () => {
    expect(validateField(delta, "")).toBe("Enter a number");
    expect(validateField(delta, -3)).toBeNull();
  });

  it("requires text that is not blank", () => {
    expect(validateField(note, "  ")).toBe("Required");
    expect(validateField(note, "ok")).toBeNull();
  });

  it("requires one of the options", () => {
    expect(validateField(item, undefined)).toBe("Choose an option");
    expect(validateField(item, "b")).toBeNull();
  });
});
