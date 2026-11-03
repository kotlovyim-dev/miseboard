import type { Scope } from "@miseboard/engine";
import type { LandingSnapshot } from "../data/landing-snapshot";

export function buildBindingScope(snapshot: LandingSnapshot): Scope {
  return {
    venuesQuery: { data: snapshot, isLoading: false },
    revenueQuery: { data: snapshot, isLoading: false },
    ordersQuery: { data: snapshot, isLoading: false },
    venueSelect: { value: snapshot.venues[0]?.id },
  };
}
