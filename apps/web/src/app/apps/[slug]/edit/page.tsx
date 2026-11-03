import { notFound } from "next/navigation";
import { EditorShell } from "@/editor/layout/editor-shell";
import { DEMO_SLUG, demoApp } from "@/runtime/demo-app";

export default async function EditAppPage({ params }: PageProps<"/apps/[slug]/edit">) {
  const { slug } = await params;
  if (slug !== DEMO_SLUG) notFound();

  return <EditorShell config={demoApp.config} />;
}
