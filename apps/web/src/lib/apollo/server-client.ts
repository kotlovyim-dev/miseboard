import { registerApolloClient } from "@apollo/client-integration-nextjs";
import { headers } from "next/headers";
import { makeClient } from "./make-client";

export const { getClient } = registerApolloClient(async () => {
  const cookie = (await headers()).get("cookie");
  return makeClient(cookie ? { cookie } : {});
});
