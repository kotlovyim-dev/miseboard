import { EvaluationError } from "./evaluation-error";
import { KYIV_TIME_ZONE, startOfKyivDay } from "./kyiv-day";
import { MAX_ARRAY_ITEMS } from "./limits";
import { readProperty } from "./safe-access";

export interface HelperContext {
  now: () => Date;
}
export type Helper = (args: unknown[], context: HelperContext) => unknown;
export type HelperRegistry = Readonly<Record<string, Helper>>;

const KOPECKS_PER_HRYVNIA = 100;

const uahFormat = new Intl.NumberFormat("uk-UA", {
  style: "currency",
  currency: "UAH",
  currencyDisplay: "narrowSymbol",
});
const dateFormat = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: KYIV_TIME_ZONE,
});

export const defaultHelpers: HelperRegistry = {
  sum: ([items, key]) => total("sum", pick(asArray("sum", items), key)),
  avg: ([items, key]) => average("avg", pick(asArray("avg", items), key)),
  count: ([items]) => asArray("count", items).length,
  map: ([items, key]) => pick(asArray("map", items), key),
  filter: ([items, key, value]) =>
    asArray("filter", items).filter((item) => readProperty(item, key) === value),
  formatUAH: ([kopecks]) => uahFormat.format(asNumber("formatUAH", kopecks) / KOPECKS_PER_HRYVNIA),
  formatDate: ([iso]) => dateFormat.format(asDate("formatDate", iso)),
  round: ([number, digits = 0]) => roundTo(asNumber("round", number), asNumber("round", digits)),
  len: ([target]) => lengthOf(target),
  today: (_args, { now }) => startOfKyivDay(now(), 0),
  daysAgo: ([days], { now }) => startOfKyivDay(now(), asNumber("daysAgo", days)),
};

function asArray(helper: string, value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new EvaluationError(`${helper} expects an array`);
  if (value.length > MAX_ARRAY_ITEMS) {
    throw new EvaluationError(`Arrays are limited to ${MAX_ARRAY_ITEMS} items`);
  }
  return value;
}

function asNumber(helper: string, value: unknown): number {
  if (typeof value === "number") return value;
  throw new EvaluationError(`${helper} expects a number`);
}

function asDate(helper: string, value: unknown): Date {
  const date = new Date(typeof value === "string" ? value : NaN);
  if (Number.isNaN(date.getTime())) throw new EvaluationError(`${helper} expects an ISO date`);
  return date;
}

function pick(items: unknown[], key: unknown): unknown[] {
  return key === undefined ? items : items.map((item) => readProperty(item, key));
}

function total(helper: string, values: unknown[]): number {
  return values.reduce<number>((sum, value) => sum + asNumber(helper, value), 0);
}

function average(helper: string, values: unknown[]): number {
  return values.length === 0 ? 0 : total(helper, values) / values.length;
}

function roundTo(number: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}

function lengthOf(target: unknown): number {
  if (typeof target === "string" || Array.isArray(target)) return target.length;
  throw new EvaluationError("len expects text or an array");
}
