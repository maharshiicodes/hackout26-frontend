"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";

export default function LandingNav() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const isLoggedIn = hasHydrated && !!token;

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur-sm transition-colors duration-300 ${
        scrolled ? "border-black/10" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-lg tracking-tight text-black">
          Re<span className="text-blue-600">Carbon</span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          <a href="#capabilities" className="text-sm text-black/60 hover:text-black">
            Capabilities
          </a>
          <a href="#how-it-works" className="text-sm text-black/60 hover:text-black">
            How it works
          </a>
          <Link href="/logistics/login" className="text-sm text-black/60 hover:text-black">
            Logistics partner?
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-black/70 hover:text-black">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
