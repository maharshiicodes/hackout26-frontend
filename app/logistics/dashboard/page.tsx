"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useLogisticsAuthStore } from "@/app/store/logisticsAuthStore";
import { useLogisticsProfileStore } from "@/app/store/logisticsProfileStore";

// Placeholder landing spot for a logged-in logistics company. Real
// dashboard content (serviceable pincodes, shipments, etc.) comes later.
export default function LogisticsDashboardPage() {
  const router = useRouter();
  const logisticsCompanyId = useLogisticsAuthStore((state) => state.logisticsCompanyId);
  const logout = useLogisticsAuthStore((state) => state.logout);
  const resetProfile = useLogisticsProfileStore((state) => state.reset);

  function handleLogout() {
    logout();
    // Clear the cached profile/pincodes so a different company logging in
    // on this browser doesn't briefly see the previous company's data.
    resetProfile();
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
      <div className="flex items-center gap-3">
        <Link
          href="/logistics/dashboard/profile"
          className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <User className="h-4 w-4" />
          View profile
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-fit items-center gap-2 rounded-lg border border-black/15 px-4 py-2 text-sm font-medium text-black/70 transition-colors hover:bg-black/5"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
