import { LandingSection } from "../layout/landing-section";
import { SectionHeading } from "../layout/section-heading";
import { RoleMenuCrop } from "../crops/role-menu-crop";
import { Reveal } from "../motion/reveal";
import { EarlyAdopters } from "./early-adopters";
import { RoleRows } from "./role-rows";

export function RolesSection() {
  return (
    <LandingSection headingId="roles-heading">
      <Reveal>
        <SectionHeading id="roles-heading" className="max-w-[16ch]">
          Built for the people on the pass
        </SectionHeading>
      </Reveal>
      <div className="mt-16 grid gap-x-10 gap-y-16 lg:mt-24 lg:grid-cols-[5fr_6fr]">
        <Reveal delay={100} className="lg:sticky lg:top-8 lg:self-start">
          <RoleMenuCrop />
        </Reveal>
        <RoleRows />
      </div>
      <EarlyAdopters />
    </LandingSection>
  );
}
