export type ShortcutAction = "togglePalette" | "duplicate" | "undo" | "redo" | "showHelp";

export interface ShortcutKeys {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
}

export function resolveShortcut(keys: ShortcutKeys, isTyping: boolean): ShortcutAction | null {
  const hasModifier = keys.metaKey || keys.ctrlKey;
  if (hasModifier && keys.key === "k") return "togglePalette";
  if (isTyping) return null;
  if (hasModifier && keys.key.toLowerCase() === "z") return keys.shiftKey ? "redo" : "undo";
  if (hasModifier && keys.key === "d") return "duplicate";
  if (!hasModifier && keys.key === "?") return "showHelp";
  return null;
}
