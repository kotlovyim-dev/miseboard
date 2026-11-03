"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import type { FormValue, ResolvedField } from "./form-fields";

interface FormFieldInputProps {
  field: ResolvedField;
  value: FormValue | undefined;
  error: string | null;
  onChange: (value: FormValue) => void;
  onBlur: () => void;
}

const SELECT_CLASS =
  "h-8 w-full rounded-md border border-input bg-card px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 aria-invalid:border-destructive";

export function FormFieldInput({ field, value, error, onChange, onBlur }: FormFieldInputProps) {
  const inputId = useId();
  const errorId = useId();
  const shared = {
    id: inputId,
    "aria-invalid": error !== null,
    "aria-describedby": error ? errorId : undefined,
    onBlur,
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {field.label}
      </label>
      {field.type === "select" ? (
        <select
          {...shared}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
          className={SELECT_CLASS}
        >
          <option value="">Select an option</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <Input
          {...shared}
          type={field.type}
          value={value ?? ""}
          onChange={(event) =>
            onChange(field.type === "number" ? parseNumber(event.target.value) : event.target.value)
          }
        />
      )}
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function parseNumber(text: string) {
  return text === "" ? "" : Number(text);
}
