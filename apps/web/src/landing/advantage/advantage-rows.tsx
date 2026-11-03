import type { LandingSnapshot } from "../data/landing-snapshot";
import { ErrorCrop } from "../crops/error-crop";
import { StatsCrop } from "../crops/stats-crop";
import { TwoTabsCrop } from "../crops/two-tabs-crop";
import { UndoCrop } from "../crops/undo-crop";
import { Reveal } from "../motion/reveal";

interface AdvantageRowsProps {
  snapshot: LandingSnapshot;
}

export function AdvantageRows({ snapshot }: AdvantageRowsProps) {
  const rows = [
    {
      title: "Errors that name the word",
      text: "When a binding fails, the engine says what went wrong and underlines where. A circular reference is named, not just refused.",
      crop: <ErrorCrop />,
      width: "xl:w-[380px]",
    },
    {
      title: "Mark ready, then change your mind",
      text: "The table updates before the server answers, and a five-second Undo sends the inverse mutation.",
      crop: <UndoCrop />,
      width: "xl:w-[360px]",
    },
    {
      title: "Two tabs, one pass",
      text: "Orders arrive over a GraphQL subscription, so every screen on the pass shows the same ticket moving.",
      crop: <TwoTabsCrop />,
      width: "xl:w-[440px]",
    },
    {
      title: "A schema built for kitchens",
      text: "Orders, venues and stock come seeded, with a Restaurant Ops template, so the first screen is a real one.",
      crop: <StatsCrop snapshot={snapshot} />,
      width: "xl:w-[300px]",
    },
  ];

  return (
    <ul className="space-y-20 md:space-y-28">
      {rows.map(({ title, text, crop, width }) => (
        <li key={title} className="grid items-start gap-8 xl:grid-cols-8">
          <Reveal className="xl:col-span-4">
            <h3 className="font-display text-heading leading-[0.95]">{title}</h3>
            <p className="mt-4 max-w-[34ch] text-lg leading-relaxed">{text}</p>
          </Reveal>
          <Reveal
            delay={120}
            className={`lg:justify-self-end xl:col-span-4 xl:col-start-5 ${width}`}
          >
            {crop}
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
