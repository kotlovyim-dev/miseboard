import { describe, expect, it } from "vitest";
import { formatSavedAt } from "./format-saved-at";

const NOW = Date.parse("2026-11-03T12:00:00Z");

describe("formatSavedAt", () => {
  it("says just now under a minute", () => {
    expect(formatSavedAt("2026-11-03T11:59:30Z", NOW)).toBe("Saved just now");
  });

  it("uses minutes, hours and days", () => {
    expect(formatSavedAt("2026-11-03T11:57:00Z", NOW)).toBe("Saved 3 minutes ago");
    expect(formatSavedAt("2026-11-03T09:00:00Z", NOW)).toBe("Saved 3 hours ago");
    expect(formatSavedAt("2026-11-01T12:00:00Z", NOW)).toBe("Saved 2 days ago");
  });
});
