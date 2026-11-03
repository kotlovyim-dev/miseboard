"use client";

import { Button } from "@/components/ui/button";
import { useCreateApp } from "@/lib/apps/use-create-app";

export function OpenTemplateButton({ disabledReason }: { disabledReason?: string }) {
  const { createFromTemplate, isCreating } = useCreateApp();

  return (
    <Button
      size="sm"
      variant="secondary"
      disabled={Boolean(disabledReason) || isCreating}
      title={disabledReason}
      onClick={() => void createFromTemplate()}
    >
      Open template
    </Button>
  );
}
