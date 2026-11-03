"use client";

import { useState } from "react";
import { useEditorStore } from "@/editor/store/editor-store";
import { CommandPalette } from "./command-palette";
import { ShortcutHelpDialog } from "./shortcut-help-dialog";
import { useEditorShortcuts } from "./use-editor-shortcuts";

export function EditorShortcuts() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEditorShortcuts({
    togglePalette: () => setIsPaletteOpen((isOpen) => !isOpen),
    showHelp: () => setIsHelpOpen(true),
    duplicate: () => {
      const { mode, selectedId, duplicateWidget } = useEditorStore.getState();
      if (mode === "edit" && selectedId) duplicateWidget(selectedId);
    },
  });

  return (
    <>
      <CommandPalette isOpen={isPaletteOpen} onOpenChange={setIsPaletteOpen} />
      <ShortcutHelpDialog isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
    </>
  );
}
