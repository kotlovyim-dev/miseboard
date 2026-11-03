import { describe, expect, it } from "vitest";
import { evaluateTemplate } from "@miseboard/engine";
import { buildStaticSnapshot } from "../data/static-snapshot";
import { BINDING_EXAMPLES, PREFILLED_BINDING } from "./binding-examples";
import { buildBindingScope } from "./binding-scope";

const scope = buildBindingScope(buildStaticSnapshot(new Date("2026-11-03T12:00:00Z")));

describe("binding examples", () => {
  it("answers the prefilled binding with the first venue", () => {
    expect(evaluateTemplate(PREFILLED_BINDING, scope)).toEqual({
      ok: true,
      value: "Kashtan Kitchen",
    });
  });

  it("evaluates every example except the typo", () => {
    const [money, today] = BINDING_EXAMPLES.map(({ source }) => evaluateTemplate(source, scope));

    expect(money).toMatchObject({ ok: true, value: expect.stringContaining("₴") });
    expect(today).toMatchObject({ ok: true });
  });

  it("fails the typo with a message", () => {
    const typo = BINDING_EXAMPLES.at(-1);

    expect(evaluateTemplate(typo?.source ?? "", scope)).toMatchObject({
      ok: false,
      error: "formatUAH expects a number",
    });
  });
});
