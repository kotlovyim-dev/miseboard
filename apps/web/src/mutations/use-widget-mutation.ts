"use client";

import { useApolloClient } from "@apollo/client/react";
import { toast } from "sonner";
import { useRole } from "@/lib/role/use-role";
import { useRuntime, useRuntimeScope } from "@/runtime/runtime-context";
import { runWidgetMutation } from "./run-widget-mutation";
import type { WidgetMutation } from "./run-widget-mutation";

export const VIEWER_MUTATION_REASON = "Viewers can't change data. Switch to Manager or Admin.";

export function useWidgetMutation() {
  const client = useApolloClient();
  const { config } = useRuntime();
  const scope = useRuntimeScope();
  const { canMutate } = useRole();

  const run = async (mutation: Omit<WidgetMutation, "scope">) => {
    const outcome = await runWidgetMutation(client, config.queries, { ...mutation, scope });
    if (outcome.ok) toast.success("Done");
    else toast.error(outcome.error);
    return outcome;
  };

  return { run, canMutate, disabledReason: canMutate ? undefined : VIEWER_MUTATION_REASON };
}
