import { describe, expect, it } from "vitest";
import { AppConfig } from "./app-config";
import { findDuplicateIds } from "./duplicate-ids";
import { fullConfig, ordersQuery, textWidget } from "./fixtures";

describe("findDuplicateIds", () => {
  it("returns nothing when every id is unique", () => {
    expect(findDuplicateIds(AppConfig.parse(fullConfig))).toEqual([]);
  });

  it("finds an id used by a widget and a query", () => {
    const config = AppConfig.parse({
      ...fullConfig,
      widgets: [...fullConfig.widgets, { ...textWidget, id: ordersQuery.id }],
    });

    expect(findDuplicateIds(config)).toEqual(["ordersQuery"]);
  });

  it("finds an id used by two widgets", () => {
    const config = AppConfig.parse({
      ...fullConfig,
      widgets: [textWidget, textWidget],
    });

    expect(findDuplicateIds(config)).toEqual(["header"]);
  });

  it("lists each duplicated id once", () => {
    const config = AppConfig.parse({
      ...fullConfig,
      queries: [ordersQuery, ordersQuery, ordersQuery],
    });

    expect(findDuplicateIds(config)).toEqual(["ordersQuery"]);
  });
});
