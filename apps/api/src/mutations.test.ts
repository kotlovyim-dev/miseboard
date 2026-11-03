import type { AddressInfo } from "node:net";
import { createClient } from "graphql-ws";
import { WebSocket } from "ws";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestClient, createTestDatabase, seedTestDatabase } from "./fixtures";
import { createHttpServer } from "./server";

const { db, pool } = createTestDatabase();
const { query: runQuery, queryRaw } = createTestClient(db);

const UPDATE_STATUS = `
  mutation ($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) { id status }
  }
`;

const ADJUST_INVENTORY = `
  mutation ($id: ID!, $delta: Float!) { adjustInventory(id: $id, delta: $delta) { id qty } }
`;

const UPDATE_MENU_ITEM = `
  mutation ($input: UpdateMenuItemInput!) {
    updateMenuItem(input: $input) { id name price isActive }
  }
`;

const MISSING_UUID = "00000000-0000-7000-8000-000000000000";

function globalId(typename: string) {
  return Buffer.from(`${typename}:${MISSING_UUID}`).toString("base64");
}

beforeAll(() => seedTestDatabase(db));
afterAll(() => pool.end());

async function firstOrder() {
  const data = await runQuery("{ orders(first: 1) { edges { node { id venue { id } } } } }");
  return data.orders.edges[0].node;
}

async function firstInventoryItem() {
  const data = await runQuery("{ venues { inventory { id qty } } }");
  return data.venues[0].inventory[0];
}

function errorCode(body: { errors: { extensions: { code: string } }[] }) {
  return body.errors[0]?.extensions.code;
}

describe("updateOrderStatus", () => {
  it("changes the status of an order", async () => {
    const order = await firstOrder();

    const data = await runQuery(UPDATE_STATUS, { id: order.id, status: "READY" });

    expect(data.updateOrderStatus).toEqual({ id: order.id, status: "READY" });
  });

  it("reports NOT_FOUND for an unknown order", async () => {
    const body = await queryRaw(UPDATE_STATUS, { id: globalId("Order"), status: "READY" });

    expect(errorCode(body)).toBe("NOT_FOUND");
  });
});

describe("adjustInventory", () => {
  it("adds the delta to the stock", async () => {
    const item = await firstInventoryItem();

    const data = await runQuery(ADJUST_INVENTORY, { id: item.id, delta: 10 });

    expect(data.adjustInventory.qty).toBe(item.qty + 10);
  });

  it("rejects a delta that would make stock negative and keeps the stock", async () => {
    const item = await firstInventoryItem();

    const body = await queryRaw(ADJUST_INVENTORY, { id: item.id, delta: -(item.qty + 1) });

    expect(errorCode(body)).toBe("BAD_USER_INPUT");
    expect((await firstInventoryItem()).qty).toBe(item.qty);
  });

  it("reports NOT_FOUND for an unknown item", async () => {
    const body = await queryRaw(ADJUST_INVENTORY, { id: globalId("InventoryItem"), delta: 1 });

    expect(errorCode(body)).toBe("NOT_FOUND");
  });
});

describe("updateMenuItem", () => {
  it("changes only the given fields", async () => {
    const { menuItems } = await runQuery("{ menuItems { id name } }");
    const target = menuItems[0];

    const data = await runQuery(UPDATE_MENU_ITEM, {
      input: { id: target.id, price: 12345, isActive: false },
    });

    expect(data.updateMenuItem).toEqual({
      id: target.id,
      name: target.name,
      price: 12345,
      isActive: false,
    });
  });

  it("rejects a negative price with BAD_USER_INPUT", async () => {
    const { menuItems } = await runQuery("{ menuItems { id } }");

    const body = await queryRaw(UPDATE_MENU_ITEM, { input: { id: menuItems[0].id, price: -1 } });

    expect(errorCode(body)).toBe("BAD_USER_INPUT");
  });
});

describe("orderUpdated subscription", () => {
  it("delivers an updated order over the websocket, filtered by venue", async () => {
    const server = createHttpServer(db);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    const client = createClient({
      url: `ws://localhost:${port}/graphql`,
      webSocketImpl: WebSocket,
    });
    const order = await firstOrder();
    const events = client.iterate({
      query: "subscription ($venueId: ID) { orderUpdated(venueId: $venueId) { id status } }",
      variables: { venueId: order.venue.id },
    });
    const received = events.next();
    await new Promise((resolve) => setTimeout(resolve, 200));

    await runQuery(UPDATE_STATUS, { id: order.id, status: "SERVED" });

    const event = await received;
    expect(event.value.data.orderUpdated).toEqual({ id: order.id, status: "SERVED" });
    await client.dispose();
    server.close();
  });
});
