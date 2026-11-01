import type { NodeEvaluation } from "@miseboard/engine";
import type { EvaluatedProps, WidgetProps } from "@/widgets/types";

export interface EvaluatedWidgetProps {
  props: EvaluatedProps;
  errors: string[];
}

export function mergeEvaluatedProps(
  widgetId: string,
  props: WidgetProps,
  evaluation: NodeEvaluation = {},
): EvaluatedWidgetProps {
  const merged: EvaluatedProps = { ...props };
  const errors: string[] = [];
  for (const [field, result] of Object.entries(evaluation)) {
    if (result.ok) merged[field] = result.value;
    else errors.push(`${widgetId}.${field}: ${result.error}`);
  }
  return { props: merged, errors };
}
