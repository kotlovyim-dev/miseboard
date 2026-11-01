import { EvaluationError } from "./evaluation-error";

const BLOCKED_KEYS: ReadonlySet<string> = new Set(["__proto__", "constructor", "prototype"]);

export function readProperty(target: unknown, key: unknown): unknown {
  if (typeof key === "string" && BLOCKED_KEYS.has(key)) {
    throw new EvaluationError(`Access to ${key} is not allowed`);
  }
  if (typeof target === "string") return key === "length" ? target.length : undefined;
  if (Array.isArray(target)) return readArray(target, key);
  if (typeof target === "object" && target !== null) return readObject(target, key);
  return undefined;
}

function readArray(items: readonly unknown[], key: unknown): unknown {
  if (key === "length") return items.length;
  return typeof key === "number" && Number.isInteger(key) ? items[key] : undefined;
}

function readObject(target: object, key: unknown): unknown {
  if (typeof key !== "string" && typeof key !== "number") return undefined;
  const name = String(key);
  return Object.hasOwn(target, name) ? Reflect.get(target, name) : undefined;
}
