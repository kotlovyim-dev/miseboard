import type { DocumentNode } from "graphql";
import type { QueryConfig } from "@miseboard/config";
import { evaluateTemplate } from "@miseboard/engine";
import type { Scope } from "@miseboard/engine";
import { parseDocument } from "@/runtime/query-runner";

export interface MutationClient {
  mutate: (options: {
    mutation: DocumentNode;
    variables: Record<string, unknown>;
  }) => Promise<unknown>;
}

export interface WidgetMutation {
  mutationId: string;
  variables: Record<string, string>;
  scope: Scope;
  local: Scope;
}

export type MutationOutcome = { ok: true; data: unknown } | { ok: false; error: string };

type Variables = { ok: true; values: Record<string, unknown> } | { ok: false; error: string };

export async function runWidgetMutation(
  client: MutationClient,
  queries: readonly QueryConfig[],
  { mutationId, variables, scope, local }: WidgetMutation,
): Promise<MutationOutcome> {
  const mutation = queries.find((query) => query.id === mutationId && query.kind === "mutation");
  if (!mutation) return { ok: false, error: `Unknown mutation "${mutationId}"` };
  const document = parseDocument(mutation.document);
  if (!document.ok) return document;
  const evaluated = evaluateVariables(variables, { ...scope, ...local });
  if (!evaluated.ok) return evaluated;
  try {
    const { data } = (await client.mutate({
      mutation: document.value,
      variables: evaluated.values,
    })) as { data?: unknown };
    return { ok: true, data };
  } catch (caught) {
    return { ok: false, error: caught instanceof Error ? caught.message : String(caught) };
  }
}

function evaluateVariables(variables: Record<string, string>, scope: Scope): Variables {
  const values: Record<string, unknown> = {};
  for (const [name, source] of Object.entries(variables)) {
    const result = evaluateTemplate(source, scope);
    if (!result.ok) return { ok: false, error: `${name}: ${result.error}` };
    values[name] = result.value;
  }
  return { ok: true, values };
}
