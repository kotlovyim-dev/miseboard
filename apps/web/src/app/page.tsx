import { ApiStatus } from "@/components/api-status";
import { RoleSwitcher } from "@/components/role-switcher";
import { OrderStatusLegend } from "@/components/order-status-legend";

export default function HomePage() {
  return (
    <>
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-4xl items-center justify-between px-4 sm:px-6">
          <span className="font-display text-base font-semibold">MiseBoard</span>
          <RoleSwitcher />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-2xl font-semibold">Apps</h1>
        <ApiStatus />
        <OrderStatusLegend />
      </main>
    </>
  );
}
