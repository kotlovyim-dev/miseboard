"use client";

import { useApolloClient } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { showErrorToast, showUndoToast } from "@/mutations/undo-toast";
import { CreateAppMutation, DeleteAppMutation, SaveAppMutation } from "./app-documents";

interface DeletableApp {
  id: string;
  name: string;
  config: unknown;
}

export function useDeleteApp() {
  const client = useApolloClient();
  const router = useRouter();

  const restore = async ({ name, config }: DeletableApp) => {
    try {
      const { data } = await client.mutate({ mutation: CreateAppMutation, variables: { name } });
      if (!data) return;
      const { id, updatedAt } = data.createApp;
      await client.mutate({
        mutation: SaveAppMutation,
        variables: { id, config, expectedUpdatedAt: updatedAt },
      });
      router.refresh();
    } catch {
      showErrorToast(`Couldn't bring back ${name}. It stays deleted.`);
    }
  };

  return async (app: DeletableApp) => {
    try {
      await client.mutate({ mutation: DeleteAppMutation, variables: { id: app.id } });
    } catch {
      showErrorToast(`Couldn't delete ${app.name}. Try again.`);
      return;
    }
    router.refresh();
    showUndoToast(`Deleted ${app.name}`, () => void restore(app));
  };
}
