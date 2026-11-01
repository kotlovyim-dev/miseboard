import { describe, expect, it } from "vitest";
import { isNumericColumn } from "./cell-format";
import { evaluateRows } from "./evaluate-rows";

const records = [
  { id: "a", total: 1500, venue: { name: "Kashtan" } },
  { id: "b", total: 2500, venue: { name: "Dnipro" } },
];

describe("evaluateRows", () => {
  it("evaluates a cell expression once per row with the row in scope", () => {
    const columns = [{ key: "venue", label: "Venue", cell: "{{ row.venue.name }}" }];

    const rows = evaluateRows("table1", columns, records, {});

    expect(rows.map((row) => row.cells.venue)).toEqual(["Kashtan", "Dnipro"]);
  });

  it("reads other widgets and queries from the runtime scope", () => {
    const columns = [{ key: "label", label: "Label", cell: "{{ prefix.value }}-{{ row.id }}" }];

    const rows = evaluateRows("table1", columns, records, { prefix: { value: "no" } });

    expect(rows.map((row) => row.cells.label)).toEqual(["no-a", "no-b"]);
  });

  it("falls back to the row field when a column has no cell expression", () => {
    const rows = evaluateRows("table1", [{ key: "id", label: "Id" }], records, {});

    expect(rows.map((row) => row.cells.id)).toEqual(["a", "b"]);
  });

  it("names the widget and column when a cell expression fails", () => {
    const columns = [{ key: "total", label: "Total", cell: "{{ formatDate(row.venue) }}" }];

    expect(() => evaluateRows("table1", columns, records, {})).toThrow(/^table1\.columns\.total: /);
  });
});

describe("isNumericColumn", () => {
  const rows = evaluateRows(
    "table1",
    [
      { key: "total", label: "Total", cell: "{{ formatUAH(row.total) }}" },
      { key: "id", label: "Id" },
    ],
    records,
    {},
  );

  it("treats a column as numeric when its source values are numbers", () => {
    expect(isNumericColumn("total", rows)).toBe(true);
  });

  it("keeps text columns left aligned", () => {
    expect(isNumericColumn("id", rows)).toBe(false);
  });
});
