"use client";

import Link from "next/link";
import { Leaf, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";

export default function LandingNav() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = hasHydrated && !!token;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Leaf className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-heading text-lg font-semibold tracking-tight text-black">
            ReCarbon
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <a href="#features" className="text-sm text-black/60 hover:text-black">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-black/60 hover:text-black">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Dashboard
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-black/70 hover:text-black"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
