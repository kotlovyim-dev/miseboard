import type { Server } from "node:http";
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import type { createGraphqlServer } from "./server";

type Yoga = ReturnType<typeof createGraphqlServer>;
type Envelop = ReturnType<Yoga["getEnveloped"]>;
type RootValue = Pick<Envelop, "execute" | "subscribe">;

export function serveSubscriptions(server: Server, yoga: Yoga) {
  const webSocketServer = new WebSocketServer({ server, path: yoga.graphqlEndpoint });

  useServer(
    {
      execute: (args) => (args.rootValue as RootValue).execute(args),
      subscribe: (args) => (args.rootValue as RootValue).subscribe(args),
      onSubscribe: async (socketContext, _id, params) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } = yoga.getEnveloped({
          ...socketContext,
          req: socketContext.extra.request,
          socket: socketContext.extra.socket,
          params,
        });
        const args = {
          schema,
          operationName: params.operationName,
          document: parse(params.query),
          variableValues: params.variables,
          contextValue: await contextFactory(),
          rootValue: { execute, subscribe },
        };
        const errors = validate(args.schema, args.document);
        return errors.length > 0 ? errors : args;
      },
    },
    webSocketServer,
  );

  server.on("close", () => webSocketServer.close());
}
