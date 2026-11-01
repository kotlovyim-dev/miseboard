"use client";

import { ApolloNextAppProvider } from "@apollo/client-integration-nextjs";
import { Toaster } from "@/components/ui/sonner";
import { makeClient } from "@/lib/apollo/make-client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
      <Toaster position="bottom-right" />
    </ApolloNextAppProvider>
  );
}
