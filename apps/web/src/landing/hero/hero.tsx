import Link from "next/link";
import type { OrderRow } from "../data/order-rows";
import { DEMO_HREF, APPS_HREF } from "../layout/landing-links";
import { LandingButton } from "../layout/landing-button";
import { HeroOrders } from "./hero-orders";
import { LandingNav } from "./landing-nav";

export function Hero({ rows }: { rows: OrderRow[] }) {
  return (
    <header className="flex flex-col justify-between gap-20 lg:min-h-svh bg-highlighter px-4 py-5 text-highlighter-foreground md:px-8 md:py-6">
      <LandingNav />
      <div className="pb-8 md:pb-12">
        <h1 className="landing-rise font-display text-[clamp(44px,13vw,200px)] leading-[0.92]">
          <span className="block">
            Kitchen tools{" "}
            <span className="landing-shutter my-3 block aspect-[3/2] w-full overflow-hidden align-baseline md:my-0 md:inline-block md:aspect-auto md:h-[0.78em] md:w-[2.4em]">
              <HeroOrders rows={rows} />
            </span>
          </span>
          <span className="block">built before service</span>
        </h1>
        <p className="landing-rise mt-10 [--delay:350ms] max-w-[44ch] text-[clamp(18px,1.6vw,24px)] leading-snug md:mt-12">
          Mise is Retool for the kitchen pass: drop widgets on a canvas, bind them to live orders,
          stock and revenue with <code className="font-mono text-[0.9em]">{"{{ }}"}</code>, and ship
          the screen before the first ticket prints.
        </p>
        <div className="landing-rise mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 [--delay:450ms]">
          <LandingButton href={DEMO_HREF} variant="ink">
            Open the demo
          </LandingButton>
          <Link
            href={APPS_HREF}
            className="text-lg underline underline-offset-4 outline-none hover:decoration-2 focus-visible:decoration-2"
          >
            Build your own
          </Link>
        </div>
      </div>
    </header>
  );
}
