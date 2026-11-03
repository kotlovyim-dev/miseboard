import { PanelHeader } from "./panel-header";

interface EditorPanelProps {
  title: string;
  hint: string;
}

export function EditorPanel({ title, hint }: EditorPanelProps) {
  return (
    <section aria-label={title} className="flex h-full min-h-0 flex-col overflow-hidden">
      <PanelHeader title={title} />
      <p className="p-3 text-sm text-muted-foreground">{hint}</p>
    </section>
  );
}
