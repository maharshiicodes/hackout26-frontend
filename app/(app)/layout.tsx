"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
  // so a logged-in user isn't bounced to /login on refresh.
  if (!hasHydrated || !token) return null;

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
