"use client";

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
import { Toaster } from "@/components/ui/sonner";
import type { Role } from "@miseboard/schema";
import { makeClient } from "@/lib/apollo/make-client";
import { RoleContext } from "@/lib/role/role-context";

export function Providers({ role, children }: { role: Role; children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <RoleContext.Provider value={role}>{children}</RoleContext.Provider>
      <Toaster position="bottom-right" />
    </ApolloNextAppProvider>
  );
}
