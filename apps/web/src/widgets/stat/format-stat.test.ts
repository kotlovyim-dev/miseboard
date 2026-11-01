import { describe, expect, it } from "vitest";
import { formatStatValue, formatTrend } from "./format-stat";

const plain = (text: string) => text.replace(/\s/g, " ");

describe("formatStatValue", () => {
  it("groups digits in a plain number", () => {
    expect(plain(formatStatValue(1234567, "number"))).toBe("1 234 567");
  });

  it("shows kopecks as hryvnias with the currency sign", () => {
    expect(plain(formatStatValue(123450, "uah"))).toBe("1 234,50 ₴");
  });

  it("shows a fraction as a percentage with one decimal", () => {
    expect(plain(formatStatValue(0.1234, "percent"))).toBe("12,3%");
  });
});

describe("formatTrend", () => {
  it("signs a rise and a fall", () => {
    expect(plain(formatTrend(0.05))).toBe("+5%");
    expect(plain(formatTrend(-0.025))).toBe("-2,5%");
  });

  it("leaves a flat trend unsigned", () => {
    expect(plain(formatTrend(0))).toBe("0%");
  });
});
