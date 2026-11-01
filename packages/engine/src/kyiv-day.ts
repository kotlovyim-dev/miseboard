export const KYIV_TIME_ZONE = "Europe/Kyiv";

const DAY_MS = 86_400_000;
const SECOND_MS = 1000;

const wallClock = new Intl.DateTimeFormat("en-CA", {
  timeZone: KYIV_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

export function startOfKyivDay(now: Date, daysBack: number): string {
  const wallNow = wallClockAsUtc(now.getTime());
  const wallMidnight = wallNow - (wallNow % DAY_MS) - daysBack * DAY_MS;
  const guess = wallMidnight - offsetAt(wallMidnight);
  return new Date(wallMidnight - offsetAt(guess)).toISOString();
}

function offsetAt(timestamp: number): number {
  return wallClockAsUtc(timestamp) - timestamp;
}

function wallClockAsUtc(timestamp: number): number {
  const wholeSecond = timestamp - (timestamp % SECOND_MS);
  const fields = Object.fromEntries(
    wallClock.formatToParts(wholeSecond).map((part) => [part.type, Number(part.value)]),
  );
  return Date.UTC(
    fields.year ?? NaN,
    (fields.month ?? NaN) - 1,
    fields.day,
    fields.hour,
    fields.minute,
    fields.second,
  );
}
