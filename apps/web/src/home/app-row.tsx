"use client";

import Link from "next/link";
import { IdChip } from "@/components/id-chip";
import { useRole } from "@/lib/role/use-role";
import { AppRowMenu } from "./app-row-menu";
import { SavedAt } from "./saved-at";

export interface AppRowData {
  id: string;
  name: string;
  slug: string;
  config: unknown;
  updatedAt: string;
}

export function AppRow({ app }: { app: AppRowData }) {
  const { canEdit } = useRole();

  return (
    <li className="flex items-center gap-2 pr-2 hover:bg-accent/50">
      <Link
        href={`/apps/${app.slug}`}
        className="flex min-w-0 flex-1 flex-col gap-1 px-3 py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:gap-3"
      >
        <span className="truncate font-display text-xl">{app.name}</span>
        <IdChip id={app.slug} className="self-start" />
        <span className="sm:ml-auto">
          <SavedAt updatedAt={app.updatedAt} />
        </span>
      </Link>
      {canEdit && <AppRowMenu app={app} />}
    </li>
  );
}
