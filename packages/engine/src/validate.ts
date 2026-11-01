import type jsep from "jsep";
import { BINARY_PRECEDENCE, UNARY_OPERATORS } from "./operators";
import type { Ast } from "./parse";

export type Validation = { ok: true } | { ok: false; error: string };

const BLOCKED_NAMES: ReadonlySet<string> = new Set(["__proto__", "constructor", "prototype"]);

export function validateExpression(ast: Ast, helperNames: ReadonlySet<string>): Validation {
  const error = findError(ast, helperNames);
  return error === undefined ? { ok: true } : { ok: false, error };
}

function findError(expression: Ast, helperNames: ReadonlySet<string>): string | undefined {
  const node = expression as jsep.CoreExpression;
  const findInChildren = (children: (Ast | null)[]) => findFirstError(children, helperNames);

  switch (node.type) {
    case "Literal":
      return undefined;
    case "Identifier":
      return checkName(node.name);
    case "MemberExpression":
      return checkLiteralKey(node.property) ?? findInChildren([node.object, node.property]);
    case "UnaryExpression":
      return UNARY_OPERATORS.includes(node.operator)
        ? findInChildren([node.argument])
        : `Operator ${node.operator} is not allowed`;
    case "BinaryExpression":
      return Object.hasOwn(BINARY_PRECEDENCE, node.operator)
        ? findInChildren([node.left, node.right])
        : `Operator ${node.operator} is not allowed`;
    case "ConditionalExpression":
      return findInChildren([node.test, node.consequent, node.alternate]);
    case "ArrayExpression":
      return findInChildren(node.elements);
    case "CallExpression":
      return checkCall(node, helperNames) ?? findInChildren(node.arguments);
    case "ThisExpression":
      return "this is not allowed";
    case "SequenceExpression":
      return "Comma expressions are not allowed";
    case "Compound":
      return node.body.length === 0
        ? "Expression is empty"
        : "Only one expression is allowed between {{ and }}";
    default:
      return node satisfies never;
  }
}

function findFirstError(
  children: (Ast | null)[],
  helperNames: ReadonlySet<string>,
): string | undefined {
  for (const child of children) {
    const error =
      child === null ? "Empty array slots are not allowed" : findError(child, helperNames);
    if (error !== undefined) return error;
  }
  return undefined;
}

function checkName(name: string): string | undefined {
  return BLOCKED_NAMES.has(name) ? `Access to ${name} is not allowed` : undefined;
}

function checkLiteralKey(property: Ast): string | undefined {
  const key = property as jsep.CoreExpression;
  return key.type === "Literal" && typeof key.value === "string" ? checkName(key.value) : undefined;
}

function checkCall(
  node: jsep.CallExpression,
  helperNames: ReadonlySet<string>,
): string | undefined {
  const callee = node.callee as jsep.CoreExpression;
  if (callee.type !== "Identifier") return "Only helper functions can be called";
  return helperNames.has(callee.name) ? undefined : `Unknown helper ${callee.name}`;
}
