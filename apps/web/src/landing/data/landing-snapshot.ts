import type { ResultOf } from "@miseboard/schema";
import type { LandingQuery } from "./landing-documents";

export type LandingSnapshot = ResultOf<typeof LandingQuery>;
