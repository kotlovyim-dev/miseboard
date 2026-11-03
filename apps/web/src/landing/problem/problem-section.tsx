import { LandingSection } from "../layout/landing-section";
import { SectionHeading } from "../layout/section-heading";
import { Reveal } from "../motion/reveal";
import { Engraving } from "./engraving";

const PROBLEMS = [
  "Today's orders across every venue.",
  "What is running low before the next delivery.",
  "Revenue so far today.",
];

const TODAY = [
  "A spreadsheet, exported again every shift.",
  "The point-of-sale system's fixed reports, which show what its vendor chose.",
  "A generic builder that starts from an empty canvas and knows nothing about orders or venues.",
];

export function ProblemSection() {
  return (
    <LandingSection headingId="problem-heading">
      <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <SectionHeading id="problem-heading">Every shift needs a new screen</SectionHeading>
          </Reveal>
          <Reveal delay={80} className="mt-10 max-w-[34ch]">
            <ul className="space-y-4 text-statement leading-tight font-medium">
              {PROBLEMS.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
            <p className="mt-8 text-lg">
              Each one is a screen someone has to build by hand, and building it takes a developer
              days.
            </p>
          </Reveal>
        </div>
        <Reveal delay={160} className="lg:pt-6">
          <h3 className="font-display text-heading leading-[0.95]">How it is solved today</h3>
          <ul className="mt-8 max-w-[28ch] space-y-5 text-statement leading-snug">
            {TODAY.map((way) => (
              <li key={way}>{way}</li>
            ))}
          </ul>
        </Reveal>
      </div>
      <Reveal className="mt-20 md:mt-28">
        <Engraving />
      </Reveal>
    </LandingSection>
  );
}
