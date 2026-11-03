import type { AddressInfo } from "node:net";
import { createClient } from "graphql-ws";
import { WebSocket } from "ws";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { TEST_COOKIE, createTestClient, createTestDatabase, seedTestDatabase } from "./fixtures";
import { ROLE_COOKIE_NAME, signRole } from "./role-cookie";
import type { Role } from "./roles";
import { createGraphqlServer, createHttpServer } from "./server";

const { db, pool } = createTestDatabase();
const { queryRaw } = createTestClient(db);

const UPDATE_STATUS = `
  mutation ($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) { id status }
  }
`;

const SAVE_APP = `
  mutation ($id: ID!, $config: JSON!, $expectedUpdatedAt: DateTime!) {
    saveApp(id: $id, config: $config, expectedUpdatedAt: $expectedUpdatedAt) { __typename }
  }
`;

const VIEWER = "{ viewer { role } }";

function globalId(typename: string) {
  return Buffer.from(`${typename}:00000000-0000-7000-8000-000000000000`).toString("base64");
}

function cookieFor(role: Role) {
  return `${ROLE_COOKIE_NAME}=${signRole(role, TEST_COOKIE.secret)}`;
}

function asRole(role: Role) {
  return { cookie: cookieFor(role) };
}

function errorCode(body: { errors: { extensions: { code: string } }[] }) {
  return body.errors[0]?.extensions.code;
}

beforeAll(() => seedTestDatabase(db));
afterAll(() => pool.end());

describe("role enforcement", () => {
  it("refuses updateOrderStatus for a Viewer", async () => {
    const variables = { id: globalId("Order"), status: "READY" };

    const body = await queryRaw(UPDATE_STATUS, variables, asRole("VIEWER"));

    expect(errorCode(body)).toBe("FORBIDDEN");
  });

  it("refuses saveApp for a Manager", async () => {
    const variables = {
      id: globalId("App"),
      config: { version: 1, queries: [], widgets: [] },
      expectedUpdatedAt: new Date().toISOString(),
    };

    const body = await queryRaw(SAVE_APP, variables, asRole("MANAGER"));

    expect(errorCode(body)).toBe("FORBIDDEN");
  });

  it("lets a Manager reach updateOrderStatus", async () => {
    const variables = { id: globalId("Order"), status: "READY" };

    const body = await queryRaw(UPDATE_STATUS, variables, asRole("MANAGER"));

    expect(errorCode(body)).toBe("NOT_FOUND");
  });
});

describe("role cookie", () => {
  it("falls back to ADMIN when the signature is tampered", async () => {
    const forged = `${ROLE_COOKIE_NAME}=VIEWER.${"0".repeat(64)}`;

    const body = await queryRaw(VIEWER, undefined, { cookie: forged });

    expect(body.data.viewer.role).toBe("ADMIN");
  });

  it("falls back to ADMIN when the role was swapped under a valid signature", async () => {
    const signature = signRole("VIEWER", TEST_COOKIE.secret).split(".")[1];
    const swapped = `${ROLE_COOKIE_NAME}=MANAGER.${signature}`;

    const body = await queryRaw(VIEWER, undefined, { cookie: swapped });

    expect(body.data.viewer.role).toBe("ADMIN");
  });

  it("sets a signed HttpOnly SameSite=Lax cookie from setRole", async () => {
    const yoga = createGraphqlServer(db, TEST_COOKIE);

    const response = await yoga.fetch("http://localhost/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", "x-miseboard-csrf": "1" },
      body: JSON.stringify({ query: "mutation { setRole(role: VIEWER) { role } }" }),
    });

    expect(response.headers.get("set-cookie")).toBe(
      `${cookieFor("VIEWER")}; Path=/; SameSite=Lax; HttpOnly`,
    );
  });

  it("applies the cookie role to websocket operations", async () => {
    const server = createHttpServer(db, TEST_COOKIE);
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    const client = createClient({
      url: `ws://localhost:${port}/graphql`,
      webSocketImpl: class extends WebSocket {
        constructor(url: string, protocols?: string | string[]) {
          super(url, protocols, { headers: asRole("VIEWER") });
        }
      },
    });

    const result = await client.iterate({ query: VIEWER }).next();

    expect(result.value.data.viewer.role).toBe("VIEWER");
    await client.dispose();
    server.close();
  });
});

describe("csrf header", () => {
  it("rejects a simple request without the header", async () => {
    const yoga = createGraphqlServer(db, TEST_COOKIE);

    const response = await yoga.fetch("http://localhost/graphql?query=%7Bviewer%7Brole%7D%7D");

    expect(response.status).toBe(403);
  });

  it("accepts a simple request that carries the header", async () => {
    const yoga = createGraphqlServer(db, TEST_COOKIE);

    const response = await yoga.fetch("http://localhost/graphql?query=%7Bviewer%7Brole%7D%7D", {
      headers: { "x-miseboard-csrf": "1" },
    });

    expect(response.status).toBe(200);
  });
});
