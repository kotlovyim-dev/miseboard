"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Role } from "@miseboard/schema";
import { SetRoleMutation } from "./role-documents";

export function useSwitchRole() {
  const router = useRouter();
  const [setRole, { loading }] = useMutation(SetRoleMutation);

  const switchRole = async (role: Role) => {
    try {
      await setRole({ variables: { role } });
      router.refresh();
    } catch {
      toast.error("Couldn't switch the role. Try again.");
    }
  };

  return { switchRole, isSwitching: loading };
}
