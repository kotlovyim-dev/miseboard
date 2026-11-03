import Image from "next/image";
import { Reveal } from "../motion/reveal";

export function EarlyAdopters() {
  return (
    <div className="mt-24 grid items-center gap-12 md:mt-32 lg:grid-cols-12">
      <Reveal className="lg:col-span-5">
        <p className="max-w-[28ch] text-statement leading-snug font-medium md:max-w-none lg:max-w-[28ch]">
          Made first for a few venues with one technical person and data reachable over GraphQL.
        </p>
        <p className="mt-6 max-w-[40ch] text-lg">
          That person builds the screens once. The managers on the pass use them every service.
        </p>
      </Reveal>
      <Reveal delay={120} className="lg:col-span-7">
        <figure>
          <div className="relative aspect-[3/2] overflow-hidden bg-highlighter">
            <Image
              src="/landing/cooks-1574.jpg"
              alt="Cooks at a long table kneading dough, with a fire and a bread oven behind them, in a kitchen engraved in 1574."
              width={1280}
              height={1589}
              unoptimized
              className="absolute -mt-[93%] -ml-[11%] h-auto w-[138%] max-w-none mix-blend-multiply brightness-110 contrast-150 grayscale"
            />
          </div>
          <figcaption className="mt-3 text-lg">
            A kitchen at work in 1574, engraved for Scappi.
          </figcaption>
        </figure>
      </Reveal>
    </div>
  );
}
