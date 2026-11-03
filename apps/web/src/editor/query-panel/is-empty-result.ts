export function isEmptyResult(data: unknown) {
  return typeof data === "object" && data !== null && Object.values(data).every(isEmptyValue);
}

function isEmptyValue(value: unknown): boolean {
  if (value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object" && value !== null && "edges" in value) {
    return isEmptyValue(value.edges);
  }
  return false;
}
