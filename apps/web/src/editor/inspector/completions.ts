export interface Completion {
  label: string;
  insert: string;
}

export interface CompletionContext {
  from: number;
  items: Completion[];
}

const TRAILING_REFERENCE = /([A-Za-z_$][\w$]*)?(\.([\w$]*))?$/;

export function findCompletions(
  source: string,
  caret: number,
  scope: Record<string, unknown>,
): CompletionContext | null {
  const open = source.lastIndexOf("{{", caret);
  if (open === -1) return null;
  const close = source.indexOf("}}", open);
  if (close !== -1 && close < caret) return null;

  const typed = TRAILING_REFERENCE.exec(source.slice(open + 2, caret))?.[0] ?? "";
  const from = caret - typed.length;
  const dot = typed.indexOf(".");

  if (dot === -1) {
    const items = Object.keys(scope)
      .filter((name) => name.startsWith(typed) && name !== typed)
      .sort()
      .map((name) => ({ label: name, insert: name }));
    return items.length > 0 ? { from, items } : null;
  }

  const head = typed.slice(0, dot);
  const member = typed.slice(dot + 1);
  const target = scope[head];
  if (typeof target !== "object" || target === null) return null;
  const items = Object.keys(target)
    .filter((key) => key.startsWith(member) && key !== member)
    .sort()
    .map((key) => ({ label: key, insert: `${head}.${key}` }));
  return items.length > 0 ? { from, items } : null;
}
