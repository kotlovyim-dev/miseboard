"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ConflictDialog } from "@/editor/persistence/conflict-dialog";
import { useAutosave } from "@/editor/persistence/use-autosave";
import { useEditorStore } from "@/editor/store/editor-store";
import type { LoadedApp } from "@/lib/apps/load-app";
import { useRole } from "@/lib/role/use-role";
import { DesktopNotice } from "./desktop-notice";
import { EditorTopBar } from "./editor-top-bar";
import { PreviewPane } from "./preview-pane";

const EditorPanels = dynamic(
  () => import("./editor-panels").then((module) => module.EditorPanels),
  { ssr: false },
);

const EDIT_DENIED_TOAST_ID = "edit-denied";

export function EditorShell({ app }: { app: LoadedApp }) {
  const { slug, name, config } = app;
  const router = useRouter();
  const { canEdit } = useRole();
  const mode = useEditorStore((state) => state.mode);
  const setConfig = useEditorStore((state) => state.setConfig);
  const autosave = useAutosave(app);

  useEffect(() => setConfig(config), [config, setConfig]);

  useEffect(() => {
    if (canEdit) return;
    toast.info("Only Admins can edit apps. Showing Preview instead.", { id: EDIT_DENIED_TOAST_ID });
    router.replace(`/apps/${slug}`);
  }, [canEdit, router, slug]);

  if (!canEdit) return null;

  return (
    <div className="flex h-dvh flex-col">
      <EditorTopBar appName={name} saveStatus={autosave.status} onRetry={autosave.retry} />
      {mode === "edit" && <DesktopNotice />}
      <div className="min-h-0 flex-1">{mode === "edit" ? <EditorPanels /> : <PreviewPane />}</div>
      <ConflictDialog
        isOpen={autosave.status === "conflict"}
        onReload={autosave.reload}
        onOverwrite={autosave.overwrite}
      />
    </div>
  );
}
