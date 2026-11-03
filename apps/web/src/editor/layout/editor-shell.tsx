"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { AppConfigData } from "@miseboard/config";
import { useEditorStore } from "@/editor/store/editor-store";
import { DesktopNotice } from "./desktop-notice";
import { EditorTopBar } from "./editor-top-bar";
import { PreviewPane } from "./preview-pane";

const EditorPanels = dynamic(
  () => import("./editor-panels").then((module) => module.EditorPanels),
  { ssr: false },
);

interface EditorShellProps {
  appName: string;
  config: AppConfigData;
}

export function EditorShell({ appName, config }: EditorShellProps) {
  const mode = useEditorStore((state) => state.mode);
  const setConfig = useEditorStore((state) => state.setConfig);

  useEffect(() => setConfig(config), [config, setConfig]);

  return (
    <div className="flex h-dvh flex-col">
      <EditorTopBar appName={appName} />
      {mode === "edit" && <DesktopNotice />}
      <div className="min-h-0 flex-1">{mode === "edit" ? <EditorPanels /> : <PreviewPane />}</div>
    </div>
  );
}
