import { createDatabase } from "@miseboard/db";
import { describe, expect, it } from "vitest";
import { TEST_COOKIE } from "./fixtures";
import { createGraphqlServer } from "./server";

const { db } = createDatabase("postgres://unused@localhost:5432/unused");
const yoga = createGraphqlServer(db, TEST_COOKIE);

function postQuery(query: string) {
  return yoga.fetch("http://localhost/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query }),
  });
}

describe("graphql server", () => {
  it("returns the default role as ADMIN", async () => {
    const response = await postQuery("{ viewer { role } }");

    expect(await response.json()).toEqual({ data: { viewer: { role: "ADMIN" } } });
  });

  it("rejects a query deeper than 6 levels", async () => {
    const response = await postQuery("{ viewer { role { a { b { c { d { e } } } } } } }");
    const body = await response.json();

    expect(body.errors.map((error: { message: string }) => error.message)).toContainEqual(
      expect.stringMatching(/depth/i),
    );
    expect(body.data).toBeUndefined();
  });
});
