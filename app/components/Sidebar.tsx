"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Rss, Bookmark, Building2, LogOut, Leaf } from "lucide-react";
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
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-black/10 bg-white">
      <div className="flex items-center gap-2 px-6 py-6">
        {/*<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
          <Leaf className="h-5 w-5 text-white" />
        </div>*/}
        <span className="text-lg font-semibold tracking-tight text-black">
          ReCarbon
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
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-black/60 hover:bg-black/5 hover:text-black"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-black/10 px-3 py-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-black/60 transition-colors hover:bg-black/5 hover:text-black"
        >
          <LogOut className="h-4.5 w-4.5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
