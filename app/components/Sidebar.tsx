"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Rss, Bookmark, Building2, LogOut } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Feed", href: "/feed", icon: Rss },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Profile", href: "/profile", icon: Building2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const company = useAuthStore((state) => state.company);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    // The sidebar renders on every app route, some of which (Feed,
    // Bookmarks) never fetch the company profile themselves - fetch it here
    // so the footer card below always has a name to show, same
    // already-cached guard the pages that do fetch it use.
    if (!useAuthStore.getState().company) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-zinc-200/80 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white">
          R
        </div>
        <span className="font-heading text-lg font-semibold tracking-tight text-zinc-900">
          Re<span className="text-blue-600">Carbon</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 rounded-lg py-2.5 pl-4 pr-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50/70 text-blue-700"
                  : "text-zinc-500 hover:bg-zinc-100/80 hover:text-zinc-900"
              }`}
            >
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-600"
                />
              )}
              <Icon className={`h-4.5 w-4.5 ${isActive ? "text-blue-600" : "text-zinc-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-zinc-200/80 p-3">
        {company && (
          <div className="mb-1 flex items-center gap-2.5 rounded-lg px-2 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-semibold text-white">
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900">{company.name}</p>
              <p className="text-xs text-zinc-400">Manufacturer</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
