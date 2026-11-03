import { startOfKyivDay } from "@miseboard/engine";
import { getClient } from "@/lib/apollo/server-client";
import { LandingQuery } from "./landing-documents";
import type { LandingSnapshot } from "./landing-snapshot";
import { buildStaticSnapshot } from "./static-snapshot";

const SNAPSHOT_TIMEOUT_MS = 1500;
const MIN_ORDERS = 3;

export async function loadLandingSnapshot(): Promise<LandingSnapshot> {
  const now = new Date();
  const live = await fetchSnapshot(now).catch(() => null);
  return live ?? buildStaticSnapshot(now);
}

async function fetchSnapshot(now: Date) {
  const { data } = await (
    await getClient()
  ).query({
    query: LandingQuery,
    variables: { from: startOfKyivDay(now, 0), to: startOfKyivDay(now, -1) },
    context: { fetchOptions: { signal: AbortSignal.timeout(SNAPSHOT_TIMEOUT_MS) } },
  });
  const isUsable = data && data.venues.length > 0 && data.orders.edges.length >= MIN_ORDERS;
  return isUsable ? data : null;
}
