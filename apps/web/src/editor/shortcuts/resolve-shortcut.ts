export type ShortcutAction = "togglePalette" | "duplicate" | "showHelp";

export interface ShortcutKeys {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
}

export function resolveShortcut(keys: ShortcutKeys, isTyping: boolean): ShortcutAction | null {
  const hasModifier = keys.metaKey || keys.ctrlKey;
  if (hasModifier && keys.key === "k") return "togglePalette";
  if (isTyping) return null;
  if (hasModifier && keys.key === "d") return "duplicate";
  if (!hasModifier && keys.key === "?") return "showHelp";
  return null;
}
