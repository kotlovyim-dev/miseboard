import { Kind } from "graphql";
import type { DocumentNode } from "graphql";
import type { QueryConfig } from "@miseboard/config";
import { evaluateTemplate } from "@miseboard/engine";
import type { Scope } from "@miseboard/engine";
import { parseDocument } from "@/runtime/query-runner";
import { planMutation } from "./inverse-registry";
import type { EntityCache, InverseCall } from "./inverse-registry";

export interface MutationClient {
  cache: EntityCache;
  mutate: (options: {
    mutation: DocumentNode;
    variables: Record<string, unknown>;
    optimisticResponse?: Record<string, unknown>;
  }) => Promise<unknown>;
}

export interface WidgetMutation {
  mutationId: string;
  variables: Record<string, string>;
  scope: Scope;
  local: Scope;
}

export type MutationOutcome =
  { ok: true; data: unknown; message?: string; undo?: InverseCall } | { ok: false; error: string };

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
  const { optimisticResponse, undo, message } = planMutation(
    client.cache,
    readRootField(document.value),
    evaluated.values,
  );
  const outcome = await execute(client, document.value, evaluated.values, optimisticResponse);
  return outcome.ok ? { ...outcome, undo, message } : outcome;
}

export async function runInverseMutation(
  client: MutationClient,
  { document, variables }: InverseCall,
): Promise<MutationOutcome> {
  const parsed = parseDocument(document);
  if (!parsed.ok) return parsed;
  return execute(client, parsed.value, variables);
}

async function execute(
  client: MutationClient,
  mutation: DocumentNode,
  variables: Record<string, unknown>,
  optimisticResponse?: Record<string, unknown>,
): Promise<MutationOutcome> {
  try {
    const { data } = (await client.mutate({ mutation, variables, optimisticResponse })) as {
      data?: unknown;
    };
    return { ok: true, data };
  } catch (caught) {
    return { ok: false, error: caught instanceof Error ? caught.message : String(caught) };
  }
}

function readRootField(document: DocumentNode) {
  const operation = document.definitions.find(
    (definition) => definition.kind === Kind.OPERATION_DEFINITION,
  );
  const field = operation?.selectionSet.selections.find(
    (selection) => selection.kind === Kind.FIELD,
  );
  return field?.name.value ?? "";
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
