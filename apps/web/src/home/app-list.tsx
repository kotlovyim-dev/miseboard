import { AppRow, type AppRowData } from "./app-row";

export function AppList({ apps }: { apps: AppRowData[] }) {
  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {apps.map((app) => (
        <AppRow key={app.id} app={app} />
      ))}
    </ul>
  );
}
