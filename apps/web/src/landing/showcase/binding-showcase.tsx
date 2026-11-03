"use client";

import { useMemo, useState } from "react";
import { evaluateTemplate } from "@miseboard/engine";
import type { LandingSnapshot } from "../data/landing-snapshot";
import { BINDING_EXAMPLES, PREFILLED_BINDING } from "./binding-examples";
import { BindingAnswer } from "./binding-answer";
import { buildBindingScope } from "./binding-scope";

export function BindingShowcase({ snapshot }: { snapshot: LandingSnapshot }) {
  const [source, setSource] = useState(PREFILLED_BINDING);
  const scope = useMemo(() => buildBindingScope(snapshot), [snapshot]);
  const result = evaluateTemplate(source, scope);

  return (
    <div data-ui>
      <input
        value={source}
        onChange={(event) => setSource(event.target.value)}
        aria-label="Binding expression"
        spellCheck={false}
        autoComplete="off"
        className="w-full bg-transparent landing-code text-[clamp(40px,4.2vw,132px)] leading-tight tracking-tight text-foreground [caret-shape:block] outline-none focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring"
      />
      <div aria-live="polite" className="mt-12 min-h-28 max-w-[560px]">
        <BindingAnswer source={source} result={result} />
      </div>
      <ul className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
        {BINDING_EXAMPLES.map(({ label, source: example }) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setSource(example)}
              className="min-h-11 bg-background px-4 text-lg transition-colors outline-none hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px md:min-h-0 md:bg-transparent md:px-0 md:underline md:underline-offset-4 md:hover:bg-transparent md:hover:decoration-2"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
