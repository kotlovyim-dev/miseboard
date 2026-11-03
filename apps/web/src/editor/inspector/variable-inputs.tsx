"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { listVariableNames } from "@/editor/query-panel/list-variable-names";
import { useEditorStore } from "@/editor/store/editor-store";

interface VariableInputsProps {
  mutationId: string;
  variables: Record<string, string>;
  placeholder: string;
  onChange: (variables: Record<string, string>) => void;
}

export function VariableInputs({
  mutationId,
  variables,
  placeholder,
  onChange,
}: VariableInputsProps) {
  const document = useEditorStore(
    (state) => state.config.queries.find((query) => query.id === mutationId)?.document,
  );
  const names = useMemo(() => listVariableNames(document ?? ""), [document]);

  if (names.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Choose a mutation that declares variables to bind them here.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {names.map((name) => (
        <label key={name} className="block space-y-1.5 text-sm font-medium">
          {`$${name}`}
          <Input
            value={variables[name] ?? ""}
            placeholder={placeholder}
            onChange={(event) => onChange({ ...variables, [name]: event.target.value })}
            spellCheck={false}
            className="font-mono font-normal"
          />
        </label>
      ))}
    </div>
  );
}
