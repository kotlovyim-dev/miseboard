import { notFound } from "next/navigation";
import { EditorShell } from "@/editor/layout/editor-shell";
import { DEMO_SLUG, demoApp } from "@/runtime/demo-app";

const DEFAULT_ROLE = "ADMIN";

export default async function EditAppPage({ params }: PageProps<"/apps/[slug]/edit">) {
  const { slug } = await params;
  if (slug !== DEMO_SLUG) notFound();

  return <EditorShell appName={demoApp.name} config={demoApp.config} role={DEFAULT_ROLE} />;
}
