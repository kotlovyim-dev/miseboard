"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { readVariableTemplates } from "@/mutations/read-variable-templates";
import { useWidgetMutation } from "@/mutations/use-widget-mutation";
import { useRuntimeScope } from "@/runtime/runtime-context";
import type { WidgetComponentProps } from "../types";
import { FormFieldInput } from "./form-field-input";
import {
  readFields,
  readFormValues,
  resolveFields,
  seedDefaults,
  validateField,
} from "./form-fields";
import type { FormValue } from "./form-fields";

export function FormWidget({ id, props, state, setState }: WidgetComponentProps) {
  const scope = useRuntimeScope();
  const { run, canMutate, disabledReason } = useWidgetMutation();
  const fields = useMemo(() => resolveFields(id, readFields(props), scope), [id, props, scope]);
  const values = readFormValues(state.values);
  const seeded = seedDefaults(fields, values);
  const isSubmitting = state.isSubmitting === true;
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const errors = Object.fromEntries(fields.map((f) => [f.name, validateField(f, values[f.name])]));
  const hasErrors = Object.values(errors).some((error) => error !== null);

  useEffect(() => {
    if (seeded !== values) setState({ ...state, values: seeded });
  }, [seeded, values, state, setState]);

  const handleChange = (name: string, value: FormValue) =>
    setState({ ...state, values: { ...values, [name]: value } });

  const handleBlur = (name: string) => setTouched(new Set([...touched, name]));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setTouched(new Set(fields.map((field) => field.name)));
    if (hasErrors || !canMutate) return;
    setState({ ...state, isSubmitting: true });
    await run({
      mutationId: String(props.mutation ?? ""),
      variables: readVariableTemplates(props.variables),
      local: { values },
    });
    setState({ ...state, isSubmitting: false });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <fieldset disabled={isSubmitting} className="space-y-3">
        <legend className="sr-only">{id}</legend>
        {fields.map((field) => (
          <FormFieldInput
            key={field.name}
            field={field}
            value={values[field.name]}
            error={touched.has(field.name) ? (errors[field.name] ?? null) : null}
            onChange={(value) => handleChange(field.name, value)}
            onBlur={() => handleBlur(field.name)}
          />
        ))}
      </fieldset>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isSubmitting || !canMutate}>
          {String(props.submitLabel ?? "Submit")}
        </Button>
        {disabledReason && <p className="text-xs text-muted-foreground">{disabledReason}</p>}
      </div>
    </form>
  );
}
