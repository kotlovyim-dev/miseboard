import type { LandingSnapshot } from "./data/landing-snapshot";
import { pickOrderRows } from "./data/order-rows";
import { Hero } from "./hero/hero";

const HERO_ROW_COUNT = 3;

export function LandingPage({ snapshot }: { snapshot: LandingSnapshot }) {
  return (
    <main>
      <Hero rows={pickOrderRows(snapshot, HERO_ROW_COUNT)} />
    </main>
  );
}
