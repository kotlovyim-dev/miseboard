export function PanelHeader({ title }: { title: string }) {
  return (
    <h2 className="flex h-9 shrink-0 items-center border-b border-border px-3 text-xs font-medium tracking-[0.06em] text-muted-foreground uppercase">
      {title}
    </h2>
  );
}
