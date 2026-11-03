import { DEMO_HREF, GITHUB_HREF } from "../layout/landing-links";
import { LandingButton } from "../layout/landing-button";
import { LandingSection } from "../layout/landing-section";
import { Reveal } from "../motion/reveal";

export function CtaSection() {
  return (
    <LandingSection
      headingId="cta-heading"
      className="flex min-h-[90svh] flex-col items-center justify-between bg-highlighter text-center text-highlighter-foreground md:py-16"
    >
      <Reveal>
        <h2
          id="cta-heading"
          className="max-w-[12ch] font-display text-[clamp(56px,10vw,160px)] leading-[0.92]"
        >
          Try the demo or read the code?
        </h2>
      </Reveal>
      <Reveal delay={120} className="my-16 flex flex-col items-center gap-5 md:flex-row md:gap-12">
        <LandingButton href={DEMO_HREF} variant="ink" className="w-72 md:w-52">
          Open the demo
        </LandingButton>
        <span className="text-lg">or</span>
        <LandingButton href={GITHUB_HREF} variant="paper" isExternal className="w-72 md:w-52">
          Read the code
        </LandingButton>
      </Reveal>
      <Reveal delay={200}>
        <p className="mx-auto max-w-[52ch] text-lg">
          The demo resets every night at 02:30 UTC, so break whatever you like. The whole stack runs
          from one docker compose file, or on Kayly.
        </p>
      </Reveal>
    </LandingSection>
  );
}
