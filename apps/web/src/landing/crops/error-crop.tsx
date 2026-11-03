import { evaluateTemplate } from "@miseboard/engine";
import { Input } from "@/components/ui/input";
import { BindingAnswer } from "../showcase/binding-answer";
import { CropFrame } from "./crop-frame";

const BROKEN_BINDING = "{{ formatUAH(orderQuery.data) }}";

export function ErrorCrop() {
  return (
    <CropFrame className="space-y-2 p-4 text-sm">
      <p className="font-medium">Value</p>
      <Input readOnly tabIndex={-1} value={BROKEN_BINDING} aria-invalid className="landing-code" />
      <BindingAnswer
        source={BROKEN_BINDING}
        result={evaluateTemplate(BROKEN_BINDING, {})}
        className="text-sm"
      />
    </CropFrame>
  );
}
