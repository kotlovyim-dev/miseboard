import { EditorShell } from "@/editor/layout/editor-shell";
import { loadApp } from "@/lib/apps/load-app";

export default async function EditAppPage({ params }: PageProps<"/apps/[slug]/edit">) {
  const { slug } = await params;

  return <EditorShell app={await loadApp(slug)} />;
}
