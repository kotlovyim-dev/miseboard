"use client";

import { useApolloClient } from "@apollo/client/react";
import { toast } from "sonner";
import { useRole } from "@/lib/role/use-role";
import { useRuntime, useRuntimeScope } from "@/runtime/runtime-context";
import { VIEWER_MUTATION_REASON } from "./viewer-mutation-reason";
import type { InverseCall } from "./inverse-registry";
import { runInverseMutation, runWidgetMutation } from "./run-widget-mutation";
import type { MutationOutcome, WidgetMutation } from "./run-widget-mutation";
import { showErrorToast, showUndoToast } from "./undo-toast";

export function useWidgetMutation() {
  const client = useApolloClient();
  const { config } = useRuntime();
  const scope = useRuntimeScope();
  const { canMutate } = useRole();

  const undo = async (inverse: InverseCall) => {
    const outcome = await runInverseMutation(client, inverse);
    if (outcome.ok) toast.success("Change undone");
    else showErrorToast(outcome.error);
  };

  const announce = (outcome: MutationOutcome) => {
    if (!outcome.ok) return showErrorToast(outcome.error);
    const { undo: inverse, message } = outcome;
    if (inverse && message) return showUndoToast(message, () => void undo(inverse));
    toast.success(message ?? "Done");
  };

  const run = async (mutation: Omit<WidgetMutation, "scope">) => {
    const outcome = await runWidgetMutation(client, config.queries, { ...mutation, scope });
    announce(outcome);
    return outcome;
  };

  return { run, canMutate, disabledReason: canMutate ? undefined : VIEWER_MUTATION_REASON };
}
