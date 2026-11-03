"use client";

import { useRole } from "@/lib/role/use-role";
import { NewAppDialog } from "./new-app-dialog";
import { OpenTemplateButton } from "./open-template-button";
import { ResetDemoDialog } from "./reset-demo-dialog";

const CREATE_DENIED_REASON = "Only Admins can create apps";

export function HomeActions() {
  const { canEdit } = useRole();
  const disabledReason = canEdit ? undefined : CREATE_DENIED_REASON;

  return (
    <div className="flex gap-2">
      <OpenTemplateButton disabledReason={disabledReason} />
      {canEdit && <ResetDemoDialog />}
      <NewAppDialog disabledReason={disabledReason} />
    </div>
  );
}
