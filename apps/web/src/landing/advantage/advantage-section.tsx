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
      <div className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-8 lg:col-start-5 lg:row-start-1">
          <SectionHeading id="advantage-heading">Hard parts, already done</SectionHeading>
        </Reveal>
        <Reveal
          delay={120}
          className="lg:sticky lg:top-10 lg:col-span-4 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start lg:pt-4"
        >
          <OrderPhoto />
        </Reveal>
        <div className="lg:col-span-8 lg:col-start-5 lg:row-start-2 lg:mt-12">
          <AdvantageRows snapshot={snapshot} />
        </div>
      </div>
      <Reveal className="mt-28 md:mt-40">
        <StackSentence />
      </Reveal>
    </LandingSection>
  );
}
