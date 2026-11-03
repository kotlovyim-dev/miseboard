import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createTestClient, createTestDatabase, seedTestDatabase } from "./fixtures";

const { db, pool } = createTestDatabase();
const { query: runQuery, queryRaw } = createTestClient(db);

const APP_FIELDS = "id name slug isTemplate updatedAt config";

const CREATE_APP = `
  mutation ($name: String!, $fromTemplate: Boolean) {
    createApp(name: $name, fromTemplate: $fromTemplate) { ${APP_FIELDS} }
  }
`;

const SAVE_APP = `
  mutation ($id: ID!, $config: JSON!, $expectedUpdatedAt: DateTime!) {
    saveApp(id: $id, config: $config, expectedUpdatedAt: $expectedUpdatedAt) {
      __typename
      ... on App { ${APP_FIELDS} }
      ... on VersionConflict { message latest { ${APP_FIELDS} } }
    }
  }
`;

const DELETE_APP = "mutation ($id: ID!) { deleteApp(id: $id) }";

const textWidget = (id: string) => ({ id, type: "text", width: 12, props: { content: "Hi" } });
const configWith = (...ids: string[]) => ({
  version: 1,
  queries: [],
  widgets: ids.map(textWidget),
});

beforeAll(() => seedTestDatabase(db));
afterAll(() => pool.end());

function errorCode(body: { errors: { extensions: { code: string } }[] }) {
  return body.errors[0]?.extensions.code;
}

async function findTemplate() {
  const data = await runQuery(`{ apps { ${APP_FIELDS} } }`);
  return data.apps.find((app: { isTemplate: boolean }) => app.isTemplate);
}

async function createApp(name: string, fromTemplate = false) {
  const data = await runQuery(CREATE_APP, { name, fromTemplate });
  return data.createApp;
}

describe("apps queries", () => {
  it("lists user apps before the template", async () => {
    await createApp("Listing check");

    const data = await runQuery(`{ apps { name isTemplate } }`);

    expect(data.apps[0]).toEqual({ name: "Listing check", isTemplate: false });
    expect(data.apps.at(-1).isTemplate).toBe(true);
  });

  it("finds an app by slug and returns null for an unknown slug", async () => {
    const template = await findTemplate();

    const found = await runQuery("query ($slug: String!) { app(slug: $slug) { id } }", {
      slug: template.slug,
    });
    const missing = await runQuery(`{ app(slug: "nope") { id } }`);

    expect(found.app.id).toBe(template.id);
    expect(missing.app).toBeNull();
  });
});

describe("createApp", () => {
  it("creates an empty app with a slug from the name", async () => {
    const app = await createApp("Kitchen Board");

    expect(app.slug).toBe("kitchen-board");
    expect(app.config).toEqual({ version: 1, queries: [], widgets: [] });
  });

  it("makes the slug unique when the name repeats", async () => {
    const first = await createApp("Same name");
    const second = await createApp("Same name");

    expect([first.slug, second.slug]).toEqual(["same-name", "same-name-2"]);
  });

  it("copies the template config", async () => {
    const template = await findTemplate();

    const app = await createApp("From template", true);

    expect(app.config).toEqual(template.config);
    expect(app.isTemplate).toBe(false);
  });
});

describe("saveApp", () => {
  it("stores the config and moves updatedAt forward", async () => {
    const app = await createApp("Save me");
    await sleep(5);
    const config = configWith("title");

    const data = await runQuery(SAVE_APP, {
      id: app.id,
      config,
      expectedUpdatedAt: app.updatedAt,
    });

    expect(data.saveApp.__typename).toBe("App");
    expect(data.saveApp.config).toEqual(config);
    expect(data.saveApp.updatedAt > app.updatedAt).toBe(true);
  });

  it("returns a conflict with the latest app when updatedAt is stale", async () => {
    const app = await createApp("Conflict");
    await sleep(5);
    const saved = await runQuery(SAVE_APP, {
      id: app.id,
      config: configWith("first"),
      expectedUpdatedAt: app.updatedAt,
    });

    const data = await runQuery(SAVE_APP, {
      id: app.id,
      config: configWith("second"),
      expectedUpdatedAt: app.updatedAt,
    });

    expect(data.saveApp.__typename).toBe("VersionConflict");
    expect(data.saveApp.latest.updatedAt).toBe(saved.saveApp.updatedAt);
    expect(data.saveApp.latest.config).toEqual(configWith("first"));
  });

  it("rejects duplicate ids and names the id", async () => {
    const app = await createApp("Duplicates");

    const body = await queryRaw(SAVE_APP, {
      id: app.id,
      config: configWith("same", "same"),
      expectedUpdatedAt: app.updatedAt,
    });

    expect(errorCode(body)).toBe("BAD_USER_INPUT");
    expect(body.errors[0].message).toContain("same");
  });

  it("refuses to save the template", async () => {
    const template = await findTemplate();

    const body = await queryRaw(SAVE_APP, {
      id: template.id,
      config: configWith("title"),
      expectedUpdatedAt: template.updatedAt,
    });

    expect(errorCode(body)).toBe("FORBIDDEN");
  });
});

describe("deleteApp", () => {
  it("deletes an app and returns its id", async () => {
    const app = await createApp("Delete me");

    const data = await runQuery(DELETE_APP, { id: app.id });
    const after = await runQuery("query ($slug: String!) { app(slug: $slug) { id } }", {
      slug: app.slug,
    });

    expect(data.deleteApp).toBe(app.id);
    expect(after.app).toBeNull();
  });

  it("refuses to delete the template", async () => {
    const template = await findTemplate();

    const body = await queryRaw(DELETE_APP, { id: template.id });

    expect(errorCode(body)).toBe("FORBIDDEN");
  });
});

describe("resetDemo", () => {
  it("keeps the template and reseeds the data", async () => {
    const data = await runQuery("mutation { resetDemo }");

    expect(data.resetDemo).toBe(true);
    expect(await findTemplate()).toBeDefined();
  });
});
