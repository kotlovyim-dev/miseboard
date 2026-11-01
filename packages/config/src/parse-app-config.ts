import { z } from "zod";
import { AppConfig, type AppConfigData } from "./app-config";
import { findDuplicateIds } from "./duplicate-ids";

export type ParseAppConfigResult =
  { ok: true; config: AppConfigData } | { ok: false; message: string };

export function parseAppConfig(input: unknown): ParseAppConfigResult {
  const parsed = AppConfig.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: z.prettifyError(parsed.error) };
  }

  const duplicateIds = findDuplicateIds(parsed.data);
  if (duplicateIds.length > 0) {
    return { ok: false, message: `Duplicate ids: ${duplicateIds.join(", ")}` };
  }

  return { ok: true, config: parsed.data };
}
