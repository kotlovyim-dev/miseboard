import { evaluateTemplate } from "@miseboard/engine";
import type { Scope } from "@miseboard/engine";
import type { EvaluatedProps } from "../types";

export type FormFieldType = "text" | "number" | "select";
export type FormValue = string | number;
export type FormValues = Record<string, FormValue>;

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  default?: string;
  options?: string;
}

export interface FormOption {
  label: string;
  value: string;
}

export interface ResolvedField {
  name: string;
  label: string;
  type: FormFieldType;
  defaultValue: FormValue | undefined;
  options: FormOption[];
}

const FIELD_TYPES: readonly unknown[] = ["text", "number", "select"];

export function readFields(props: EvaluatedProps): FormFieldConfig[] {
  return Array.isArray(props.fields) ? props.fields.filter(isFormField) : [];
}

export function readFormValues(value: unknown): FormValues {
  return isRecord(value) ? (value as FormValues) : {};
}

export function resolveFields(
  widgetId: string,
  fields: FormFieldConfig[],
  scope: Scope,
): ResolvedField[] {
  const evaluate = (field: FormFieldConfig, source: string | undefined) => {
    if (source === undefined) return undefined;
    const result = evaluateTemplate(source, scope);
    if (result.ok) return result.value;
    throw new Error(`${widgetId}.fields.${field.name}: ${result.error}`);
  };
  return fields.map((field) => ({
    name: field.name,
    label: field.label,
    type: field.type,
    defaultValue: toFieldValue(field.type, evaluate(field, field.default)),
    options: toOptions(evaluate(field, field.options)),
  }));
}

export function seedDefaults(fields: ResolvedField[], values: FormValues): FormValues {
  const seeded: FormValues = {};
  for (const { name, defaultValue } of fields) {
    if (defaultValue !== undefined && !(name in values)) seeded[name] = defaultValue;
  }
  return Object.keys(seeded).length === 0 ? values : { ...seeded, ...values };
}

export function validateField(field: ResolvedField, value: FormValue | undefined) {
  if (field.type === "number") return typeof value === "number" ? null : "Enter a number";
  if (field.type === "select") {
    return field.options.some((option) => option.value === value) ? null : "Choose an option";
  }
  return String(value ?? "").trim() === "" ? "Required" : null;
}

function toFieldValue(type: FormFieldType, raw: unknown): FormValue | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (type !== "number") return String(raw);
  const number = Number(raw);
  return Number.isFinite(number) ? number : undefined;
}

function toOptions(raw: unknown): FormOption[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((entry): FormOption[] => {
    if (typeof entry === "string" || typeof entry === "number") {
      return [{ label: String(entry), value: String(entry) }];
    }
    if (isRecord(entry) && entry.value !== undefined && entry.value !== null) {
      return [{ label: String(entry.label ?? entry.value), value: String(entry.value) }];
    }
    return [];
  });
}

function isFormField(value: unknown): value is FormFieldConfig {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    typeof value.label === "string" &&
    FIELD_TYPES.includes(value.type)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
