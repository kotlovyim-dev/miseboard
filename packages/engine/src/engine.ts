import { evaluateTemplate } from "./evaluate-template";
import type { EvaluationOptions, EvaluationResult } from "./evaluate-template";
import { buildDependencyGraph, findCycles, sortTopologically } from "./graph";
import type { EngineNode } from "./graph";
import type { Scope } from "./interpret";

export type NodeEvaluation = Record<string, EvaluationResult>;
export type Evaluations = Map<string, NodeEvaluation>;

export interface EngineOptions extends EvaluationOptions {
  externalNames?: readonly string[];
}
export interface Engine {
  evaluateAll(state: Scope): Evaluations;
  referencesTo(id: string): string[];
}

const DEFAULT_EXTERNAL_NAMES = ["role"];

export function createEngine(
  nodes: readonly EngineNode[],
  { externalNames = DEFAULT_EXTERNAL_NAMES, ...evaluation }: EngineOptions = {},
): Engine {
  const graph = buildDependencyGraph(nodes, new Set(externalNames));
  const cycleMessages = describeCycles(findCycles(graph.dependencies));
  const order = sortTopologically(graph, new Set(cycleMessages.keys()));
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  const failureOf = (node: EngineNode, field: string): EvaluationResult | undefined => {
    const cycleMessage = cycleMessages.get(node.id);
    if (cycleMessage) return { ok: false, error: cycleMessage, at: 0 };
    return graph.unknownIdentifiers.get(node.id)?.[field];
  };

  const evaluateNode = (node: EngineNode, state: Scope): NodeEvaluation =>
    Object.fromEntries(
      Object.entries(node.fields).map(([field, source]) => [
        field,
        failureOf(node, field) ?? evaluateTemplate(source, state, evaluation),
      ]),
    );

  const evaluateIds = (ids: readonly string[], state: Scope): Evaluations => {
    const evaluations: Evaluations = new Map();
    for (const id of ids) {
      const node = nodesById.get(id);
      if (node) evaluations.set(id, evaluateNode(node, state));
    }
    return evaluations;
  };

  return {
    evaluateAll: (state) => evaluateIds([...order, ...cycleMessages.keys()], state),
    referencesTo: (id) => [...(graph.dependents.get(id) ?? [])],
  };
}

function describeCycles(cycles: string[][]): Map<string, string> {
  const messages = new Map<string, string>();
  for (const cycle of cycles) {
    const message = `Circular dependency: ${cycle.join(" → ")}`;
    cycle.forEach((id) => {
      if (!messages.has(id)) messages.set(id, message);
    });
  }
  return messages;
}
