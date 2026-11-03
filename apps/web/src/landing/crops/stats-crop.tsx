import { StatWidget } from "@/widgets/stat/stat-widget";
import type { LandingSnapshot } from "../data/landing-snapshot";
import { CropFrame } from "./crop-frame";

type StatFormat = "uah" | "number";

const ignoreState = () => undefined;

export function StatsCrop({ snapshot }: { snapshot: LandingSnapshot }) {
  const revenue = snapshot.venues.flatMap((venue) => venue.revenue);
  const totalRevenue = revenue.reduce((sum, { total }) => sum + total, 0);
  const totalOrders = revenue.reduce((sum, { orders }) => sum + orders, 0);

  return (
    <div className="grid gap-3">
      <StatPreview id="revenueStat" label="Revenue today" value={totalRevenue} format="uah" />
      <StatPreview id="ordersStat" label="Orders today" value={totalOrders} format="number" />
    </div>
  );
}

function StatPreview(props: { id: string; label: string; value: number; format: StatFormat }) {
  const { id, ...stat } = props;

  return (
    <CropFrame className="p-4">
      <StatWidget id={id} props={stat} state={{}} setState={ignoreState} />
    </CropFrame>
  );
}
