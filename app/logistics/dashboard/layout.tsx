"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLogisticsAuthStore } from "@/app/store/logisticsAuthStore";

export default function LogisticsDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useLogisticsAuthStore((state) => state.hasHydrated);
  const token = useLogisticsAuthStore((state) => state.token);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/logistics/login");
    }
  }, [hasHydrated, token, router]);

  // Wait for the persisted token to load before deciding whether to redirect,
  // so a logged-in company isn't bounced to /logistics/login on refresh. Show
  // a spinner instead of a blank screen during that brief window (and while
  // redirecting).
  if (!hasHydrated || !token) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-black/40" />
      </div>
    );
  }

  return <div className="min-h-screen w-full bg-gray-50">{children}</div>;
}
