import type { Role } from "@miseboard/schema";
import { getClient } from "@/lib/apollo/server-client";
import { ViewerQuery } from "./role-documents";

const FALLBACK_ROLE: Role = "VIEWER";

export async function fetchRole(): Promise<Role> {
  try {
    const { data } = await (await getClient()).query({ query: ViewerQuery });
    return data?.viewer.role ?? FALLBACK_ROLE;
  } catch {
    return FALLBACK_ROLE;
  }
}
