import { Pencil } from "lucide-react";
import { IdChip } from "@/components/id-chip";
import { Button } from "@/components/ui/button";
import { VIEWER_MUTATION_REASON } from "@/mutations/viewer-mutation-reason";
import { CropFrame } from "../crops/crop-frame";
import { OrderRowCrop } from "../crops/order-row-crop";
import { Reveal } from "../motion/reveal";

const ROLE_ROWS = [
  {
    title: "Admins build the screens",
    detail:
      "They edit apps in the editor: place widgets, write the queries and bind them with {{ }}.",
    crop: (
      <CropFrame className="flex items-center justify-between gap-3 p-4">
        <IdChip id="ordersTable" />
        <Button variant="outline" size="sm" tabIndex={-1}>
          <Pencil aria-hidden strokeWidth={1.5} />
          Edit
        </Button>
      </CropFrame>
    ),
  },
  {
    title: "Managers act on them",
    detail: "They open the screen during service, mark orders ready and restock items.",
    crop: (
      <CropFrame>
        <OrderRowCrop time="15:17" status="PREPARING" total={112500}>
          <Button variant="secondary" size="sm" tabIndex={-1}>
            Mark ready
          </Button>
        </OrderRowCrop>
      </CropFrame>
    ),
  },
  {
    title: "Viewers watch",
    detail: "They see the same live screen, read-only. The buttons stay disabled and say why.",
    crop: (
      <CropFrame>
        <OrderRowCrop time="15:17" status="PREPARING" total={112500}>
          <Button variant="secondary" size="sm" disabled title={VIEWER_MUTATION_REASON}>
            Mark ready
          </Button>
        </OrderRowCrop>
        <p className="px-4 pb-3 text-sm text-muted-foreground">{VIEWER_MUTATION_REASON}</p>
      </CropFrame>
    ),
  },
];

export function RoleRows() {
  return (
    <ul className="space-y-14">
      {ROLE_ROWS.map(({ title, detail, crop }, index) => (
        <li key={title}>
          <Reveal delay={index * 80}>
            <h3 className="font-display text-heading leading-[0.95]">{title}</h3>
            <p className="mt-3 max-w-[40ch] text-lg">{detail}</p>
            <div className="mt-5 max-w-md">{crop}</div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
