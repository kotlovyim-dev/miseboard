"use client";

import { useEffect, useMemo, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import type { AppConfigData } from "@miseboard/config";
import { widgetRegistry } from "@/widgets/registry";
import { connectEngine } from "./connect-engine";
import { createRuntime } from "./create-runtime";
import { startQueryRunner } from "./query-runner";
import type { QueryRunner } from "./query-runner";
import { RuntimeContext } from "./runtime-context";

interface AppRuntimeProviderProps {
  config: AppConfigData;
  role: string;
  children: React.ReactNode;
}

export function AppRuntimeProvider({ config, role, children }: AppRuntimeProviderProps) {
  const client = useApolloClient();
  const runtime = useMemo(() => createRuntime(config, role, widgetRegistry), [config, role]);
  const runnerRef = useRef<QueryRunner | null>(null);

  useEffect(() => {
    const stopEngine = connectEngine(runtime.store, runtime.engine);
    const runner = startQueryRunner(client, config.queries, runtime.store);
    runnerRef.current = runner;
    return () => {
      runner.stop();
      stopEngine();
    };
  }, [client, config, runtime]);

  const value = useMemo(
    () => ({
      store: runtime.store,
      config,
      retryQuery: (queryId: string) => runnerRef.current?.retry(queryId),
    }),
    [runtime, config],
  );

  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}
