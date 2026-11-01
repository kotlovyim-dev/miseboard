import type jsep from "jsep";
import { applyBinary, applyUnary } from "./apply-operator";
import { EvaluationError } from "./evaluation-error";
import type { HelperContext, HelperRegistry } from "./helpers";
import { MAX_ARRAY_ITEMS, MAX_STEPS } from "./limits";
import type { Ast } from "./parse";
import { readProperty } from "./safe-access";

export type Scope = Readonly<Record<string, unknown>>;
export interface Environment {
  scope: Scope;
  helpers: HelperRegistry;
  context: HelperContext;
}

type Visit = (expression: Ast) => unknown;

export function interpret(ast: Ast, environment: Environment): unknown {
  let steps = 0;
  const visit: Visit = (expression) => {
    steps += 1;
    if (steps > MAX_STEPS)
      throw new EvaluationError(`Expression is longer than ${MAX_STEPS} steps`);
    return evaluateNode(expression as jsep.CoreExpression, visit, environment);
  };
  return visit(ast);
}

function evaluateNode(node: jsep.CoreExpression, visit: Visit, environment: Environment): unknown {
  switch (node.type) {
    case "Literal":
      return node.value;
    case "Identifier":
      return readProperty(environment.scope, node.name);
    case "MemberExpression":
      return readProperty(visit(node.object), memberKey(node, visit));
    case "UnaryExpression":
      return applyUnary(node.operator, visit(node.argument));
    case "BinaryExpression":
      return evaluateBinary(node, visit);
    case "ConditionalExpression":
      return visit(node.test) ? visit(node.consequent) : visit(node.alternate);
    case "ArrayExpression":
      return evaluateArray(node, visit);
    case "CallExpression":
      return evaluateCall(node, visit, environment);
    case "ThisExpression":
    case "SequenceExpression":
    case "Compound":
      throw new EvaluationError(`${node.type} is not supported`);
    default:
      return node satisfies never;
  }
}

function memberKey(node: jsep.MemberExpression, visit: Visit): unknown {
  if (node.computed) return visit(node.property);
  return (node.property as jsep.Identifier).name;
}

function evaluateBinary(node: jsep.BinaryExpression, visit: Visit): unknown {
  const left = visit(node.left);
  switch (node.operator) {
    case "&&":
      return left ? visit(node.right) : left;
    case "||":
      return left ? left : visit(node.right);
    case "??":
      return left ?? visit(node.right);
    default:
      return applyBinary(node.operator, left, visit(node.right));
  }
}

function evaluateArray(node: jsep.ArrayExpression, visit: Visit): unknown[] {
  if (node.elements.length > MAX_ARRAY_ITEMS) {
    throw new EvaluationError(`Arrays are limited to ${MAX_ARRAY_ITEMS} items`);
  }
  return node.elements.map((element) => (element === null ? undefined : visit(element)));
}

function evaluateCall(node: jsep.CallExpression, visit: Visit, environment: Environment): unknown {
  const name = (node.callee as jsep.Identifier).name;
  const helper = Object.hasOwn(environment.helpers, name) ? environment.helpers[name] : undefined;
  if (!helper) throw new EvaluationError(`Unknown helper ${name}`);
  return helper(node.arguments.map(visit), environment.context);
}
