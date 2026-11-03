import { describe, expect, it } from "vitest";
import { barHeightPercent, readChartPoints } from "./chart-points";

describe("readChartPoints", () => {
  it("reads values and formats ISO day labels", () => {
    const data = [{ day: "2026-11-01T22:00:00.000Z", total: 500 }];
    const [point] = readChartPoints("chart", { data, xKey: "day", yKey: "total" });

    expect(point?.value).toBe(500);
    expect(point?.label).toMatch(/2/);
    expect(point?.label).not.toContain("T");
  });

  it("keeps plain labels as text", () => {
    const data = [{ name: "Mon", total: 3 }];

    expect(readChartPoints("chart", { data, xKey: "name", yKey: "total" })[0]?.label).toBe("Mon");
  });

  it("throws when data is not an array", () => {
    expect(() => readChartPoints("chart", { data: 1, xKey: "a", yKey: "b" })).toThrow(
      "chart.data must be an array",
    );
  });

  it("throws when a value is not a number", () => {
    const props = { data: [{ a: "x", b: "y" }], xKey: "a", yKey: "b" };

    expect(() => readChartPoints("chart", props)).toThrow("chart.b must be a number");
  });
});

describe("barHeightPercent", () => {
  it("scales against the maximum", () => {
    expect(barHeightPercent(50, 200)).toBe(25);
  });

  it("is zero when every value is zero", () => {
    expect(barHeightPercent(0, 0)).toBe(0);
  });
});
