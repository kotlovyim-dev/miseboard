const MAX_PREVIEW_LENGTH = 80;

export function describeValue(value: unknown) {
  if (Array.isArray(value)) return `Array · ${value.length} ${value.length === 1 ? "row" : "rows"}`;
  const json = JSON.stringify(value) ?? "undefined";
  return json.length > MAX_PREVIEW_LENGTH ? `${json.slice(0, MAX_PREVIEW_LENGTH)}…` : json;
}

export function findErrorSpan(source: string, at: number) {
  if (!source.startsWith("{{", at)) return { start: at, end: at + 1 };
  const close = source.indexOf("}}", at);
  return { start: at, end: close === -1 ? source.length : close + 2 };
}
