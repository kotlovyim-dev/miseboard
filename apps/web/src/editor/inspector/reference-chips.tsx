"use client";

import { extractDependencies } from "@miseboard/engine";
import { IdChip } from "@/components/id-chip";
import { useEditorStore } from "@/editor/store/editor-store";

export function ReferenceChips({ source }: { source: string }) {
  const config = useEditorStore((state) => state.config);
  const setHoveredReference = useEditorStore((state) => state.setHoveredReference);
  const nodeIds = new Set([...config.widgets, ...config.queries].map((node) => node.id));
  const references = [...new Set(extractDependencies(source).map(({ name }) => name))].filter(
    (name) => nodeIds.has(name),
  );

  if (references.length === 0) return null;

  return (
    <ul aria-label="References" className="flex flex-wrap gap-1.5">
      {references.map((id) => (
        <li
          key={id}
          tabIndex={0}
          onMouseEnter={() => setHoveredReference(id)}
          onMouseLeave={() => setHoveredReference(null)}
          onFocus={() => setHoveredReference(id)}
          onBlur={() => setHoveredReference(null)}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <IdChip id={id} />
        </li>
      ))}
    </ul>
  );
}
