import { PICTURE_CREDITS } from "../data/picture-credits";
import { LandingButton } from "../layout/landing-button";
import { DECISIONS_HREF, DEMO_HREF, GITHUB_HREF, README_HREF } from "../layout/landing-links";

const FOOTER_LINKS = [
  { label: "GitHub", href: GITHUB_HREF },
  { label: "README", href: README_HREF },
  { label: "Architecture decisions", href: DECISIONS_HREF },
];

export function LandingFooter() {
  return (
    <footer className="overflow-hidden bg-ink px-4 pt-24 text-paper md:px-8 md:pt-32">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="font-display text-display leading-[0.92]">Break a screen before service.</p>
          <LandingButton href={DEMO_HREF} variant="highlighter" className="mt-10">
            Open the demo
          </LandingButton>
        </div>
        <ul className="space-y-3 text-lg lg:col-span-3 lg:col-start-10">
          {FOOTER_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="underline-offset-4 outline-none hover:underline focus-visible:underline focus-visible:decoration-2"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-20 space-y-1 text-[13px] md:mt-28">
        <p>Mise is a portfolio project. The data is fictional.</p>
        <p>
          Pictures, all public domain via Wikimedia Commons:{" "}
          {PICTURE_CREDITS.map(({ title, creator, year, page }, index) => (
            <span key={page}>
              {index > 0 && "; "}
              <a href={page} className="underline underline-offset-2">
                {title}
              </a>
              , {creator}, {year}
            </span>
          ))}
          .
        </p>
      </div>
      <p
        aria-hidden
        className="mt-3 block translate-y-[26%] font-sans text-[40vw] leading-[0.75] font-extrabold tracking-[-0.04em] [font-variation-settings:'wdth'_78] whitespace-nowrap text-highlighter select-none"
      >
        Mise
      </p>
    </footer>
  );
}
