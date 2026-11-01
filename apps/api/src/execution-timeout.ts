import { GraphQLError } from "graphql";
import type { Plugin } from "graphql-yoga";

const EXECUTION_TIMEOUT_MS = 5000;

export function useExecutionTimeout(): Plugin {
  return {
    onExecute({ args }) {
      const controller = new AbortController();
      const timer = setTimeout(
        () => controller.abort(new GraphQLError("Execution timed out")),
        EXECUTION_TIMEOUT_MS,
      );
      Object.assign(args, { signal: controller.signal });
      return { onExecuteDone: () => clearTimeout(timer) };
    },
  };
}
