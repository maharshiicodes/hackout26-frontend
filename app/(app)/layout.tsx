"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "@/app/components/Sidebar";
import { useAuthStore } from "@/app/store/authStore";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (hasHydrated && !token) {
      router.replace("/login");
    }
  }, [hasHydrated, token, router]);

  // Wait for the persisted token to load before deciding whether to redirect,
  // so a logged-in user isn't bounced to /login on refresh. Show a spinner
  // instead of a blank screen during that brief window (and while redirecting).
  if (!hasHydrated || !token) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-black/40" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
