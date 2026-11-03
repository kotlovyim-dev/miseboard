"use client";

import { useApolloClient } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { showErrorToast } from "@/mutations/undo-toast";
import { ResetDemoMutation } from "./app-documents";

export function useResetDemo() {
  const client = useApolloClient();
  const router = useRouter();
  const [isResetting, setIsResetting] = useState(false);

  const reset = async () => {
    setIsResetting(true);
    try {
      await client.mutate({ mutation: ResetDemoMutation });
      await client.clearStore();
      router.refresh();
      return true;
    } catch {
      showErrorToast("Couldn't reset the demo. Try again.");
      return false;
    } finally {
      setIsResetting(false);
    }
  };

  return { reset, isResetting };
}
