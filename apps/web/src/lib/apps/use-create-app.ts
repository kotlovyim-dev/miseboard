"use client";

import { useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/mutations/undo-toast";
import { CreateAppMutation } from "./app-documents";

const TEMPLATE_APP_NAME = "Restaurant Ops";

export function useCreateApp() {
  const client = useApolloClient();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const create = async (name: string, fromTemplate = false) => {
    setIsCreating(true);
    try {
      const { data } = await client.mutate({
        mutation: CreateAppMutation,
        variables: { name, fromTemplate },
      });
      if (data) router.push(`/apps/${data.createApp.slug}/edit`);
    } catch {
      showErrorToast("Couldn't create the app. Try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const createFromTemplate = () => create(TEMPLATE_APP_NAME, true);

  return { create, createFromTemplate, isCreating };
}
