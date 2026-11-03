import Link from "next/link";
import { DEMO_HREF, GITHUB_HREF } from "../layout/landing-links";
import { LandingButton } from "../layout/landing-button";

const NAV_LINKS = [
  { label: "Demo", href: DEMO_HREF },
  { label: "How it works", href: "#how-it-works" },
  { label: "GitHub", href: GITHUB_HREF },
];

const FOCUS_CLASSES =
  "underline-offset-4 outline-none hover:underline focus-visible:underline focus-visible:decoration-2";
const LINK_CLASSES = `text-lg ${FOCUS_CLASSES}`;

export function LandingNav() {
  return (
    <nav aria-label="Main" className="flex items-center justify-between gap-6">
      <Link href="/" className={`font-display text-4xl ${FOCUS_CLASSES}`}>
        Mise
      </Link>
      <div className="flex items-center gap-8">
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a href={href} className={LINK_CLASSES}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <LandingButton href={DEMO_HREF} variant="paper" className="h-11 px-5 md:h-12">
          Open the demo
        </LandingButton>
      </div>
    </nav>
  );
}
