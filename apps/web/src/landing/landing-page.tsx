import type { LandingSnapshot } from "./data/landing-snapshot";
import { pickOrderRows } from "./data/order-rows";
import { AdvantageSection } from "./advantage/advantage-section";
import { Hero } from "./hero/hero";
import { ProblemSection } from "./problem/problem-section";
import { RolesSection } from "./roles/roles-section";
import { SolutionSection } from "./showcase/solution-section";

const HERO_ROW_COUNT = 3;

export function LandingPage({ snapshot }: { snapshot: LandingSnapshot }) {
  return (
    <>
      <main>
        <Hero rows={pickOrderRows(snapshot, HERO_ROW_COUNT)} />
        <ProblemSection />
        <SolutionSection snapshot={snapshot} />
        <RolesSection />
        <AdvantageSection snapshot={snapshot} />
      </main>
    </>
  );
}
