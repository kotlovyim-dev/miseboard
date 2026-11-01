import { createDatabase } from "@miseboard/db";
import { describe, expect, it } from "vitest";
import { createGraphqlServer } from "./server";

const { db } = createDatabase("postgres://unused@localhost:5432/unused");
const yoga = createGraphqlServer(db);

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
});
