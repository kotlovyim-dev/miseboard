import type { ApolloClient } from "@apollo/client";
import { parseAppConfig, type AppConfigData } from "@miseboard/config";
import { SaveAppMutation } from "@/lib/apps/app-documents";
import type { SaveResult } from "./autosave";

export async function saveApp(
  client: ApolloClient,
  id: string,
  config: AppConfigData,
  expectedUpdatedAt: string,
): Promise<SaveResult> {
  const { data } = await client.mutate({
    mutation: SaveAppMutation,
    variables: { id, config, expectedUpdatedAt },
  });
  if (!data) throw new Error("The server returned no result");
  const { saveApp: result } = data;
  if (result.__typename === "App") return { kind: "saved", updatedAt: result.updatedAt };
  const latest = parseAppConfig(result.latest.config);
  if (!latest.ok) throw new Error(latest.message);
  return {
    kind: "conflict",
    latest: { updatedAt: result.latest.updatedAt, config: latest.config },
  };
}
