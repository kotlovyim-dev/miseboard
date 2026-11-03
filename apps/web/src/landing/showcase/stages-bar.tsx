import { SectionHeading } from "../layout/section-heading";
import { Reveal } from "../motion/reveal";

const STAGES = [
  {
    duration: "Ten seconds",
    clause: "First, open the Restaurant Ops template.",
    share: 14,
    tone: "bg-background text-foreground",
  },
  {
    duration: "About a minute",
    clause: "Then write the query in GraphQL.",
    share: 20,
    tone: "bg-ink text-paper",
  },
  {
    duration: "Seconds",
    clause: (
      <>
        Next, bind it to a widget with <code className="font-mono text-[0.95em]">{"{{ }}"}</code>.
      </>
    ),
    share: 14,
    tone: "bg-highlighter text-highlighter-foreground",
  },
  {
    duration: "All night",
    clause: "After that, service runs live and the screen follows every order.",
    share: 52,
    tone: "bg-accent text-accent-foreground",
  },
];

export function StagesBar() {
  return (
    <div id="how-it-works" className="mt-28 scroll-mt-8 md:mt-40">
      <Reveal>
        <SectionHeading id="stages-heading">From template to service</SectionHeading>
      </Reveal>
      <Reveal delay={100} className="mt-16 md:mt-20">
        <ol data-ui className="flex flex-col gap-1.5 lg:flex-row">
          {STAGES.map(({ duration, clause, share, tone }) => (
            <li
              key={duration}
              style={{ flexGrow: share, flexBasis: `${share}%` }}
              className="min-w-0"
            >
              <div
                className={`flex min-h-[72px] items-start p-5 font-display text-statement lg:h-[22svh] lg:min-h-48 ${tone}`}
              >
                {duration}
              </div>
              <p className="mt-4 max-w-[22ch] text-lg leading-snug">{clause}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
