"use client";

import { useEditorStore } from "@/editor/store/editor-store";
import { AppGrid } from "@/runtime/app-grid";
import { AppRuntimeProvider } from "@/runtime/app-runtime-provider";

export function PreviewPane() {
  const config = useEditorStore((state) => state.config);

  return (
    <main className="h-full overflow-auto bg-surface p-4">
      <AppRuntimeProvider config={config}>
        <AppGrid />
      </AppRuntimeProvider>
    </main>
  );
}
