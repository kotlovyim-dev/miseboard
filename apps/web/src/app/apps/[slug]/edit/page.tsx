import { EditorShell } from "@/editor/layout/editor-shell";
import { loadApp } from "@/lib/apps/load-app";

export default async function EditAppPage({ params }: PageProps<"/apps/[slug]/edit">) {
  const { slug } = await params;

  const app = await loadApp(slug);

  return <EditorShell key={app.id} app={app} />;
}
