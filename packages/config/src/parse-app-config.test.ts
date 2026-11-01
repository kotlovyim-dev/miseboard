import { describe, expect, it } from "vitest";
import { EMPTY_APP_CONFIG } from "./empty-config";
import { fullConfig, ordersQuery, textWidget } from "./fixtures";
import { parseAppConfig } from "./parse-app-config";

describe("parseAppConfig", () => {
  it("returns the parsed config for valid input", () => {
    const result = parseAppConfig(fullConfig);

    expect(result.ok && result.config.widgets).toHaveLength(5);
  });

  it("accepts the empty config", () => {
    expect(parseAppConfig(EMPTY_APP_CONFIG)).toEqual({ ok: true, config: EMPTY_APP_CONFIG });
  });

  it("fills in defaults on the returned config", () => {
    const result = parseAppConfig({
      version: 1,
      queries: [{ id: "ordersQuery", kind: "query", document: "query { orders }" }],
      widgets: [],
    });

    expect(result.ok && result.config.queries[0]).toMatchObject({
      variables: {},
      trigger: "onLoad",
    });
  });

  it("explains a bad widget id", () => {
    const result = parseAppConfig({
      ...fullConfig,
      widgets: [{ ...textWidget, id: "Bad-Id" }],
    });

    expect(result.ok).toBe(false);
    expect(!result.ok && result.message).toContain("widgets[0].id");
  });

  it("rejects a width that is not allowed", () => {
    const result = parseAppConfig({
      ...fullConfig,
      widgets: [{ ...textWidget, width: 5 }],
    });

    expect(result.ok).toBe(false);
  });

  it("names the duplicate id shared by a widget and a query", () => {
    const result = parseAppConfig({
      ...fullConfig,
      widgets: [{ ...textWidget, id: ordersQuery.id }],
    });

    expect(result).toEqual({ ok: false, message: "Duplicate ids: ordersQuery" });
  });

  it("rejects input that is not an object", () => {
    expect(parseAppConfig("nope").ok).toBe(false);
  });
});
