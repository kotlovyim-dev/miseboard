import { IdSchema, type AppConfigData } from "@miseboard/config";

export function validateNodeId(config: AppConfigData, currentId: string, candidate: string) {
  if (!IdSchema.safeParse(candidate).success) {
    return "Use a lowercase letter first, then letters, digits or underscores (40 at most).";
  }
  const isTaken = [...config.widgets, ...config.queries].some((node) => node.id === candidate);
  if (candidate !== currentId && isTaken) return `${candidate} is already used.`;
  return null;
}
