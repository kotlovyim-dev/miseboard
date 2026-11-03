const relativeFormat = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const absoluteFormat = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

export function formatSavedAt(iso: string, now = Date.now()) {
  const seconds = (new Date(iso).getTime() - now) / 1000;
  const unit = UNITS.find(([, size]) => Math.abs(seconds) >= size);
  if (!unit) return "Saved just now";
  const [name, size] = unit;
  return `Saved ${relativeFormat.format(Math.round(seconds / size), name)}`;
}

export function formatSavedAtAbsolute(iso: string) {
  return absoluteFormat.format(new Date(iso));
}
