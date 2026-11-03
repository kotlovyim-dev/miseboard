"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import type { AppConfigData } from "@miseboard/config";
import { widgetRegistry } from "@/widgets/registry";
import { connectEngine } from "./connect-engine";
import { buildEngine, createRuntime, syncRuntime } from "./create-runtime";
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
  const [{ store }] = useState(() => createRuntime(config, role, widgetRegistry));
  const engine = useMemo(() => buildEngine(config, widgetRegistry), [config]);
  const { queries } = config;
  const runnerRef = useRef<QueryRunner | null>(null);

  useEffect(() => {
    syncRuntime(store, engine, config, role, widgetRegistry);
    return connectEngine(store, engine);
  }, [store, engine, config, role]);

  useEffect(() => {
    const runner = startQueryRunner(client, queries, store);
    runnerRef.current = runner;
    return runner.stop;
  }, [client, queries, store]);

  const value = useMemo(
    () => ({
      store,
      engine,
      config,
      retryQuery: (queryId: string) => runnerRef.current?.retry(queryId),
    }),
    [store, engine, config],
  );

  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}
