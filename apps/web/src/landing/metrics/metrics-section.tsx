import { LandingSection } from "../layout/landing-section";
import { SectionHeading } from "../layout/section-heading";
import { Reveal } from "../motion/reveal";

const METRICS = [
  {
    figure: "114",
    caption:
      "unit tests in the expression engine, covering parsing, limits, cycles and blocked access.",
  },
  {
    figure: "16 ms",
    caption:
      "the budget for re-evaluating forty widgets after one change, asserted by a benchmark test.",
  },
  {
    figure: "5 s",
    caption: "to undo an action from a widget, with the inverse mutation sent behind it.",
  },
  {
    figure: "6",
    caption: "widget types, each with loading, empty and error states from one shared frame.",
  },
];

export function MetricsSection() {
  return (
    <LandingSection headingId="metrics-heading" className="bg-ink text-paper md:py-36">
      <Reveal>
        <SectionHeading id="metrics-heading">Measured, not promised</SectionHeading>
      </Reveal>
      <dl className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:mt-32 lg:grid-cols-4">
        {METRICS.map(({ figure, caption }, index) => (
          <Reveal key={figure} delay={index * 80}>
            <dt className="font-display text-[clamp(88px,10vw,176px)] leading-[0.85] text-highlighter tabular-nums">
              {figure}
            </dt>
            <dd className="mt-6 max-w-[26ch] text-lg leading-snug">{caption}</dd>
          </Reveal>
        ))}
      </dl>
    </LandingSection>
  );
}
