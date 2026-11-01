import { extractDependencies } from "./dependencies";
import type { Failure } from "./template";

export interface EngineNode {
  id: string;
  fields: Record<string, string>;
}

export interface DependencyGraph {
  dependencies: Map<string, Set<string>>;
  dependents: Map<string, Set<string>>;
  unknownIdentifiers: Map<string, Record<string, Failure>>;
}

export function buildDependencyGraph(
  nodes: readonly EngineNode[],
  externalNames: ReadonlySet<string>,
): DependencyGraph {
  const ids = new Set(nodes.map((node) => node.id));
  const graph: DependencyGraph = {
    dependencies: new Map([...ids].map((id) => [id, new Set()])),
    dependents: new Map([...ids].map((id) => [id, new Set()])),
    unknownIdentifiers: new Map(),
  };

  for (const node of nodes) {
    for (const [field, source] of Object.entries(node.fields)) {
      for (const { name, at } of extractDependencies(source)) {
        if (ids.has(name)) {
          graph.dependencies.get(node.id)?.add(name);
          graph.dependents.get(name)?.add(node.id);
        } else if (!externalNames.has(name)) {
          const failures = graph.unknownIdentifiers.get(node.id) ?? {};
          failures[field] ??= { ok: false, error: `Unknown identifier ${name}`, at };
          graph.unknownIdentifiers.set(node.id, failures);
        }
      }
    }
  }
  return graph;
}

export function findCycles(dependencies: ReadonlyMap<string, ReadonlySet<string>>): string[][] {
  const cycles: string[][] = [];
  const finished = new Set<string>();
  const path: string[] = [];

  const visit = (id: string) => {
    const start = path.indexOf(id);
    if (start !== -1) {
      cycles.push([...path.slice(start), id]);
      return;
    }
    if (finished.has(id)) return;
    path.push(id);
    dependencies.get(id)?.forEach(visit);
    path.pop();
    finished.add(id);
  };

  dependencies.forEach((_, id) => visit(id));
  return cycles;
}

export function sortTopologically(graph: DependencyGraph, excluded: ReadonlySet<string>): string[] {
  const waiting = new Map<string, number>();
  for (const [id, dependencies] of graph.dependencies) {
    if (!excluded.has(id))
      waiting.set(id, [...dependencies].filter((d) => !excluded.has(d)).length);
  }

  const order = [...waiting].filter(([, count]) => count === 0).map(([id]) => id);
  for (const id of order) {
    graph.dependents.get(id)?.forEach((dependent) => {
      if (excluded.has(dependent)) return;
      const remaining = (waiting.get(dependent) ?? 0) - 1;
      waiting.set(dependent, remaining);
      if (remaining === 0) order.push(dependent);
    });
  }
  return order;
}

export function collectDownstream(graph: DependencyGraph, id: string): Set<string> {
  const downstream = new Set<string>();
  const pending = [id];
  for (const current of pending) {
    graph.dependents.get(current)?.forEach((dependent) => {
      if (downstream.has(dependent)) return;
      downstream.add(dependent);
      pending.push(dependent);
    });
  }
  downstream.delete(id);
  return downstream;
}
