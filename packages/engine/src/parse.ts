import jsep from "jsep";
import { TOO_COMPLEX_ERROR } from "./limits";
import { BINARY_PRECEDENCE, UNARY_OPERATORS } from "./operators";
import type { Failure } from "./template";

export type Ast = jsep.Expression;
export interface ParsedExpression {
  ok: true;
  ast: Ast;
}

interface JsepError extends Error {
  index: number;
  description: string;
}

const cache = new Map<string, ParsedExpression | Failure>();

jsep.removeAllBinaryOps();
jsep.removeAllUnaryOps();
Object.entries(BINARY_PRECEDENCE).forEach(([operator, precedence]) =>
  jsep.addBinaryOp(operator, precedence),
);
UNARY_OPERATORS.forEach((operator) => jsep.addUnaryOp(operator));

export function parseExpression(source: string): ParsedExpression | Failure {
  const cached = cache.get(source);
  if (cached) return cached;

  const parsed = parseUncached(source);
  cache.set(source, parsed);
  return parsed;
}

function parseUncached(source: string): ParsedExpression | Failure {
  try {
    return { ok: true, ast: jsep(source) };
  } catch (error) {
    if (error instanceof RangeError) return { ok: false, error: TOO_COMPLEX_ERROR, at: 0 };
    if (!isJsepError(error)) throw error;
    return { ok: false, error: error.description, at: error.index };
  }
}

function isJsepError(error: unknown): error is JsepError {
  return error instanceof Error && "index" in error && "description" in error;
}
