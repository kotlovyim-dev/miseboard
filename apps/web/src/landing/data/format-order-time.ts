const timeFormat = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Europe/Kyiv",
});

export function formatOrderTime(iso: string) {
  return timeFormat.format(new Date(iso));
}
