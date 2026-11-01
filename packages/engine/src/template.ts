export const OPEN = "{{";
const CLOSE = "}}";

export interface TextSegment {
  kind: "text";
  text: string;
}
export interface ExpressionSegment {
  kind: "expression";
  source: string;
  offset: number;
}
export type Segment = TextSegment | ExpressionSegment;

export interface ParsedTemplate {
  ok: true;
  segments: Segment[];
  isSingleBlock: boolean;
}
export interface Failure {
  ok: false;
  error: string;
  at: number;
}

export function parseTemplate(source: string): ParsedTemplate | Failure {
  const segments: Segment[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const open = source.indexOf(OPEN, cursor);
    if (open === -1) {
      segments.push({ kind: "text", text: source.slice(cursor) });
      break;
    }

    const close = source.indexOf(CLOSE, open + OPEN.length);
    if (close === -1) return { ok: false, error: "Unclosed {{ block", at: open };

    if (open > cursor) segments.push({ kind: "text", text: source.slice(cursor, open) });
    segments.push({
      kind: "expression",
      source: source.slice(open + OPEN.length, close),
      offset: open,
    });
    cursor = close + CLOSE.length;
  }

  return {
    ok: true,
    segments,
    isSingleBlock: segments.length === 1 && segments[0]?.kind === "expression",
  };
}
