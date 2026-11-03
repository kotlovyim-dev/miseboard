import { describe, expect, it, vi } from "vitest";
import type { QueryConfig } from "@miseboard/config";
import { runWidgetMutation } from "./run-widget-mutation";
import type { MutationClient } from "./run-widget-mutation";

const markReady: QueryConfig = {
  id: "markReady",
  kind: "mutation",
  document:
    "mutation ($id: ID!, $status: OrderStatus!) { updateOrderStatus(id: $id, status: $status) { id } }",
  variables: {},
  trigger: "manual",
};

function setup() {
  const mutate = vi.fn(() => Promise.resolve({ data: { updateOrderStatus: { id: "o1" } } }));
  const client: MutationClient = { mutate };
  return { mutate, client };
}

describe("runWidgetMutation", () => {
  it("evaluates variables against the local scope", async () => {
    const { mutate, client } = setup();

    const outcome = await runWidgetMutation(client, [markReady], {
      mutationId: "markReady",
      variables: { id: "{{ row.id }}", status: "READY" },
      scope: { role: "MANAGER", row: { id: "ignored" } },
      local: { row: { id: "o1" } },
    });

    expect(outcome).toEqual({ ok: true, data: { updateOrderStatus: { id: "o1" } } });
    expect(mutate).toHaveBeenCalledWith(
      expect.objectContaining({ variables: { id: "o1", status: "READY" } }),
    );
  });

  it("keeps the type of a single expression", async () => {
    const { mutate, client } = setup();

    await runWidgetMutation(client, [markReady], {
      mutationId: "markReady",
      variables: { delta: "{{ values.delta }}" },
      scope: {},
      local: { values: { delta: -3 } },
    });

    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ variables: { delta: -3 } }));
  });

  it("refuses an id that is not a mutation", async () => {
    const { mutate, client } = setup();
    const query: QueryConfig = { ...markReady, kind: "query" };

    const outcome = await runWidgetMutation(client, [query], {
      mutationId: "markReady",
      variables: {},
      scope: {},
      local: {},
    });

    expect(outcome).toEqual({ ok: false, error: 'Unknown mutation "markReady"' });
    expect(mutate).not.toHaveBeenCalled();
  });

  it("names the variable whose expression fails", async () => {
    const { mutate, client } = setup();

    const outcome = await runWidgetMutation(client, [markReady], {
      mutationId: "markReady",
      variables: { id: "{{ 1 + }}" },
      scope: {},
      local: {},
    });

    expect(outcome.ok).toBe(false);
    expect(outcome.ok === false && outcome.error).toMatch(/^id: /);
    expect(mutate).not.toHaveBeenCalled();
  });

  it("reports a server error", async () => {
    const client: MutationClient = { mutate: () => Promise.reject(new Error("FORBIDDEN")) };

    const outcome = await runWidgetMutation(client, [markReady], {
      mutationId: "markReady",
      variables: {},
      scope: {},
      local: {},
    });

    expect(outcome).toEqual({ ok: false, error: "FORBIDDEN" });
  });
});
