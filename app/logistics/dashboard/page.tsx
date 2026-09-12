"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useLogisticsAuthStore } from "@/app/store/logisticsAuthStore";

// Placeholder landing spot for a logged-in logistics company. Real
// dashboard content (serviceable pincodes, shipments, etc.) comes later.
export default function LogisticsDashboardPage() {
  const router = useRouter();
  const logisticsCompanyId = useLogisticsAuthStore((state) => state.logisticsCompanyId);
  const logout = useLogisticsAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/logistics/login");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-black">
        Logistics dashboard
      </h1>
      <p className="text-sm text-black/60">
        You&apos;re signed in as logistics company{" "}
        <span className="font-medium text-black">{logisticsCompanyId}</span>.
      </p>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-fit items-center gap-2 rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/5"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </div>
  );
}
