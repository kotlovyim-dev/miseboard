import type { LandingSnapshot } from "../data/landing-snapshot";
import { LandingSection } from "../layout/landing-section";
import { SectionHeading } from "../layout/section-heading";
import { Reveal } from "../motion/reveal";
import { AdvantageRows } from "./advantage-rows";
import { OrderPhoto } from "./order-photo";
import { StackSentence } from "./stack-sentence";

export function AdvantageSection({ snapshot }: { snapshot: LandingSnapshot }) {
  return (
    <LandingSection headingId="advantage-heading" className="bg-surface">
      <div className="grid gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-8 lg:col-start-5 lg:row-start-1">
          <SectionHeading id="advantage-heading">Hard parts, already done</SectionHeading>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pt-4">
          <OrderPhoto />
        </Reveal>
      </div>
      <div className="mt-16 md:mt-28">
        <AdvantageRows snapshot={snapshot} />
      </div>
      <Reveal className="mt-28 md:mt-40">
        <StackSentence />
      </Reveal>
    </LandingSection>
  );
}
