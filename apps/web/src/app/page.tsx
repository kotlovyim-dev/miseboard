import { loadLandingSnapshot } from "@/landing/data/load-landing-snapshot";
import { LandingPage } from "@/landing/landing-page";
import "@/landing/landing.css";

export const metadata = {
  title: "Mise: Retool for the kitchen pass",
  description:
    "Drop widgets on a canvas, bind them to live orders, stock and revenue, and ship the screen before the first ticket prints.",
};

export default async function HomePage() {
  return <LandingPage snapshot={await loadLandingSnapshot()} />;
}
