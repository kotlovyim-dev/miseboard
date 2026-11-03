import { RoleSwitcher } from "@/components/role-switcher";
import { AppList } from "@/home/app-list";
import { HomeActions } from "@/home/home-actions";
import { getClient } from "@/lib/apollo/server-client";
import { AppsQuery } from "@/lib/apps/app-documents";

export default async function HomePage() {
  const { data } = await (await getClient()).query({ query: AppsQuery });
  const apps = (data?.apps ?? []).filter((app) => !app.isTemplate);

  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4 sm:px-6">
          <span className="font-display text-base font-semibold">MiseBoard</span>
          <RoleSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-semibold">Apps</h1>
          <HomeActions />
        </div>
        <div className="mt-6">
          {apps.length > 0 ? (
            <AppList apps={apps} />
          ) : (
            <p className="text-sm text-muted-foreground">
              No apps yet. Open the Restaurant Ops template or start with an empty app.
            </p>
          )}
        </div>
      </main>
    </>
  );
}
