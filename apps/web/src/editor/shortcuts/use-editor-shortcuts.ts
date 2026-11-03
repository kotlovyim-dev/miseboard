"use client";

import { useEffect } from "react";
import { resolveShortcut, type ShortcutAction } from "./resolve-shortcut";

const TYPING_SELECTOR = "input, textarea, select, [contenteditable='true']";

type ShortcutHandlers = Partial<Record<ShortcutAction, () => void>>;

export function useEditorShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isTyping =
        event.target instanceof Element && event.target.closest(TYPING_SELECTOR) !== null;
      const action = resolveShortcut(event, isTyping);
      const handler = action && handlers[action];
      if (!handler) return;
      event.preventDefault();
      handler();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
