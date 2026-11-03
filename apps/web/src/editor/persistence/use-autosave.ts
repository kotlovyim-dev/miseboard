"use client";

import { useEffect, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useEditorStore } from "@/editor/store/editor-store";
import type { LoadedApp } from "@/lib/apps/load-app";
import { createAutosaver, type AutosaveState } from "./autosave";
import { saveApp } from "./save-app";

export function useAutosave({ id, config, updatedAt }: LoadedApp) {
  const client = useApolloClient();
  const [state, setState] = useState<AutosaveState>({ status: "saved", latest: null });
  const [autosaver] = useState(() =>
    createAutosaver({
      store: useEditorStore,
      config,
      updatedAt,
      save: (next, expectedUpdatedAt) => saveApp(client, id, next, expectedUpdatedAt),
      onChange: setState,
    }),
  );

  useEffect(() => autosaver.start(), [autosaver]);

  return { ...state, ...autosaver };
}
