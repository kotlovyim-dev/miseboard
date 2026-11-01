import { notFound } from "next/navigation";
import { AppGrid } from "@/runtime/app-grid";
import { AppRuntimeProvider } from "@/runtime/app-runtime-provider";
import { DEMO_SLUG, demoApp } from "@/runtime/demo-app";

const DEFAULT_ROLE = "ADMIN";

export default async function AppPreviewPage({ params }: PageProps<"/apps/[slug]">) {
  const { slug } = await params;
  if (slug !== DEMO_SLUG) notFound();

  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-6xl items-center px-4 sm:px-6">
          <h1 className="font-display text-base font-semibold">{demoApp.name}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <AppRuntimeProvider config={demoApp.config} role={DEFAULT_ROLE}>
          <AppGrid />
        </AppRuntimeProvider>
      </main>
    </>
  );
}
