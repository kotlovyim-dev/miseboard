import { EvaluationError } from "./evaluation-error";
import { defaultHelpers } from "./helpers";
import type { HelperRegistry } from "./helpers";
import { interpret } from "./interpret";
import type { Scope } from "./interpret";
import { parseExpression } from "./parse";
import { OPEN, parseTemplate } from "./template";
import type { ExpressionSegment, Failure } from "./template";
import { validateExpression } from "./validate";

export type EvaluationResult = { ok: true; value: unknown } | Failure;

export interface EvaluationOptions {
  now?: () => Date;
  helpers?: HelperRegistry;
}

export function evaluateTemplate(
  source: string,
  scope: Scope,
  options: EvaluationOptions = {},
): EvaluationResult {
  const template = parseTemplate(source);
  if (!template.ok) return template;

  const values: unknown[] = [];
  for (const segment of template.segments) {
    if (segment.kind === "text") {
      values.push(segment.text);
      continue;
    }
    const evaluated = evaluateBlock(segment, scope, options);
    if (!evaluated.ok) return evaluated;
    values.push(template.isSingleBlock ? evaluated.value : stringify(evaluated.value));
  }

  return { ok: true, value: template.isSingleBlock ? values[0] : values.join("") };
}

function evaluateBlock(
  segment: ExpressionSegment,
  scope: Scope,
  { now = () => new Date(), helpers = defaultHelpers }: EvaluationOptions,
): EvaluationResult {
  const parsed = parseExpression(segment.source);
  if (!parsed.ok)
    return { ok: false, error: parsed.error, at: segment.offset + OPEN.length + parsed.at };

  const validation = validateExpression(parsed.ast, new Set(Object.keys(helpers)));
  if (!validation.ok) return { ok: false, error: validation.error, at: segment.offset };

  try {
    return { ok: true, value: interpret(parsed.ast, { scope, helpers, context: { now } }) };
  } catch (error) {
    if (!(error instanceof EvaluationError)) throw error;
    return { ok: false, error: error.message, at: segment.offset };
  }
}

function stringify(value: unknown): string {
  if (value === undefined || value === null) return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}
