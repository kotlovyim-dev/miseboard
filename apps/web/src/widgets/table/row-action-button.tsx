"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { useWidgetMutation } from "@/mutations/use-widget-mutation";
import type { TableRecord, TableRowAction } from "./table-columns";

interface RowActionButtonProps {
  action: TableRowAction;
  row: TableRecord;
}

export function RowActionButton({ action, row }: RowActionButtonProps) {
  const reasonId = useId();
  const { run, canMutate, disabledReason } = useWidgetMutation();
  const [isRunning, setIsRunning] = useState(false);

  const handleClick = async (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsRunning(true);
    await run({ mutationId: action.mutation, variables: action.variables, local: { row } });
    setIsRunning(false);
  };

  return (
    <span title={disabledReason}>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={!canMutate || isRunning}
        aria-describedby={disabledReason ? reasonId : undefined}
        onClick={handleClick}
        onKeyDown={(event) => event.stopPropagation()}
      >
        {action.label}
      </Button>
      {disabledReason && (
        <span id={reasonId} className="sr-only">
          {disabledReason}
        </span>
      )}
    </span>
  );
}
