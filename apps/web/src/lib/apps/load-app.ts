import { notFound } from "next/navigation";
import { parseAppConfig, type AppConfigData } from "@miseboard/config";
import { getClient } from "@/lib/apollo/server-client";
import { AppQuery } from "./app-documents";

export interface LoadedApp {
  id: string;
  name: string;
  slug: string;
  updatedAt: string;
  config: AppConfigData;
}

export async function loadApp(slug: string): Promise<LoadedApp> {
  const { data } = await (await getClient()).query({ query: AppQuery, variables: { slug } });
  if (!data?.app) notFound();
  const parsed = parseAppConfig(data.app.config);
  if (!parsed.ok) throw new Error(`The config of ${slug} is invalid: ${parsed.message}`);
  return { ...data.app, config: parsed.config };
}
