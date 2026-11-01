import type jsep from "jsep";
import { parseExpression } from "./parse";
import type { Ast } from "./parse";
import { parseTemplate } from "./template";

export interface Dependency {
  name: string;
  at: number;
}
export interface DependencyOptions {
  locals?: ReadonlySet<string>;
}

export function extractDependencies(
  source: string,
  { locals = new Set() }: DependencyOptions = {},
): Dependency[] {
  const template = parseTemplate(source);
  if (!template.ok) return [];

  return template.segments.flatMap((segment) => {
    if (segment.kind === "text") return [];
    const parsed = parseExpression(segment.source);
    if (!parsed.ok) return [];
    return [...collectNames(parsed.ast)]
      .filter((name) => !locals.has(name))
      .map((name) => ({ name, at: segment.offset }));
  });
}

function collectNames(expression: Ast): Set<string> {
  const names = new Set<string>();
  const visit = (child: Ast | null) => {
    if (child === null) return;
    const node = child as jsep.CoreExpression;
    switch (node.type) {
      case "Identifier":
        names.add(node.name);
        return;
      case "MemberExpression":
        visit(node.object);
        if (node.computed) visit(node.property);
        return;
      case "UnaryExpression":
        visit(node.argument);
        return;
      case "BinaryExpression":
        visit(node.left);
        visit(node.right);
        return;
      case "ConditionalExpression":
        [node.test, node.consequent, node.alternate].forEach(visit);
        return;
      case "ArrayExpression":
        node.elements.forEach(visit);
        return;
      case "CallExpression":
        node.arguments.forEach(visit);
        return;
      case "Literal":
      case "ThisExpression":
      case "SequenceExpression":
      case "Compound":
        return;
      default:
        return node satisfies never;
    }
  };
  visit(expression);
  return names;
}
