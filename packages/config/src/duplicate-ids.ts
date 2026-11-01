import type { AppConfigData } from "./app-config";

export function findDuplicateIds(config: AppConfigData): string[] {
  const counts = new Map<string, number>();
  for (const { id } of [...config.queries, ...config.widgets]) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...counts].filter(([, count]) => count > 1).map(([id]) => id);
}
