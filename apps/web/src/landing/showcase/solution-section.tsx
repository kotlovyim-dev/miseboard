import type { LandingSnapshot } from "../data/landing-snapshot";
import { LandingSection } from "../layout/landing-section";
import { SectionHeading } from "../layout/section-heading";
import { Reveal } from "../motion/reveal";
import { BindingShowcase } from "./binding-showcase";
import { StagesBar } from "./stages-bar";

export function SolutionSection({ snapshot }: { snapshot: LandingSnapshot }) {
  return (
    <LandingSection headingId="showcase-heading" className="bg-surface md:py-36">
      <Reveal>
        <SectionHeading id="showcase-heading">Type a binding. The kitchen answers.</SectionHeading>
      </Reveal>
      <Reveal delay={100} className="mt-16 md:mt-24">
        <BindingShowcase snapshot={snapshot} />
      </Reveal>
      <StagesBar />
    </LandingSection>
  );
}
