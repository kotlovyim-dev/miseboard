"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import type { AppConfigData } from "@miseboard/config";
import { useEditorStore } from "@/editor/store/editor-store";

const EditorPanels = dynamic(
  () => import("./editor-panels").then((module) => module.EditorPanels),
  { ssr: false },
);

interface EditorShellProps {
  config: AppConfigData;
}

export function EditorShell({ config }: EditorShellProps) {
  const setConfig = useEditorStore((state) => state.setConfig);

  useEffect(() => setConfig(config), [config, setConfig]);

  return <EditorPanels />;
}
