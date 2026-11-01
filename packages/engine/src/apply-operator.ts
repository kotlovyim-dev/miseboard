import { EvaluationError } from "./evaluation-error";

type Ordered = number | string;

const ORDERING: Readonly<Record<string, (left: Ordered, right: Ordered) => boolean>> = {
  "<": (left, right) => left < right,
  "<=": (left, right) => left <= right,
  ">": (left, right) => left > right,
  ">=": (left, right) => left >= right,
};

const ARITHMETIC: Readonly<Record<string, (left: number, right: number) => number>> = {
  "-": (left, right) => left - right,
  "*": (left, right) => left * right,
  "/": (left, right) => left / right,
  "%": (left, right) => left % right,
};

export function applyBinary(operator: string, left: unknown, right: unknown): unknown {
  if (operator === "==" || operator === "===") return left === right;
  if (operator === "!=" || operator === "!==") return left !== right;
  if (operator === "+") return add(left, right);

  const compare = ORDERING[operator];
  if (compare) return compare(...asOrderedPair(operator, left, right));

  const calculate = ARITHMETIC[operator];
  if (!calculate) throw new EvaluationError(`Operator ${operator} is not supported`);
  return calculate(asNumber(operator, left), asNumber(operator, right));
}

export function applyUnary(operator: string, argument: unknown): unknown {
  return operator === "!" ? !argument : -asNumber(operator, argument);
}

function add(left: unknown, right: unknown): number | string {
  if (typeof left === "number" && typeof right === "number") return left + right;
  if (isOrdered(left) && isOrdered(right)) return `${left}${right}`;
  throw new EvaluationError("Operator + needs numbers or text");
}

function asNumber(operator: string, value: unknown): number {
  if (typeof value === "number") return value;
  throw new EvaluationError(`Operator ${operator} needs numbers`);
}

function asOrderedPair(operator: string, left: unknown, right: unknown): [Ordered, Ordered] {
  if (isOrdered(left) && isOrdered(right) && typeof left === typeof right) return [left, right];
  throw new EvaluationError(`Operator ${operator} needs two numbers or two texts`);
}

function isOrdered(value: unknown): value is Ordered {
  return typeof value === "number" || typeof value === "string";
}
