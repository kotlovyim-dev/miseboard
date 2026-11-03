"use client";

import { useEffect, useMemo, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import type { AppConfigData } from "@miseboard/config";
import { widgetRegistry } from "@/widgets/registry";
import { connectEngine } from "./connect-engine";
import { buildEngine, createRuntime, syncRuntime } from "./create-runtime";
import { createQueryRunner } from "./query-runner";
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
  const runner = useMemo(() => createQueryRunner(client, store), [client, store]);

  useEffect(() => {
    syncRuntime(store, engine, config, role, widgetRegistry);
    return connectEngine(store, engine);
  }, [store, engine, config, role]);

  useEffect(() => runner.stop, [runner]);

  useEffect(() => runner.sync(config.queries), [runner, config.queries]);

  const value = useMemo(
    () => ({
      store,
      engine,
      config,
      retryQuery: runner.retry,
    }),
    [store, engine, config, runner],
  );

  return <RuntimeContext.Provider value={value}>{children}</RuntimeContext.Provider>;
}
