"use client";

import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { WidgetComponentProps } from "../types";
import { readOptions } from "./select-options";

export function SelectWidget({ id, props, state, setState }: WidgetComponentProps) {
  const options = readOptions(id, props);
  const value = typeof state.value === "string" ? state.value : "";
  const defaultValue = readDefault(props.default);

  useEffect(() => {
    if (state.value === null && defaultValue !== null) setState({ ...state, value: defaultValue });
  }, [state, defaultValue, setState]);

  return (
    <Select
      value={value}
      onValueChange={(next) => setState({ ...state, value: next })}
      disabled={options.length === 0}
    >
      <SelectTrigger aria-label={id} className="w-full">
        <SelectValue placeholder={options.length === 0 ? "No options" : "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function readDefault(defaultValue: unknown) {
  if (typeof defaultValue === "string" || typeof defaultValue === "number") {
    return String(defaultValue);
  }
  return null;
}
