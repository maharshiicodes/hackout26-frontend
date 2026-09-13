"use client";

import { Bookmark } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { useBookmarkStore } from "@/app/store/bookmarkStore";
import type { SellingMaterialResult } from "@/app/components/CompanyDetailsModal";

/**
 * Toggle button for bookmarking a search/feed result. Reused on both the
 * Dashboard (to add a bookmark) and the Bookmarks page (where toggling an
 * already-bookmarked item removes it) - see bookmarkStore.ts.
 */
export function BookmarkButton({
  result,
  className,
}: {
  result: SellingMaterialResult;
  className?: string;
}) {
  const companyId = useAuthStore((state) => state.companyId);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const isBookmarked = useBookmarkStore((state) =>
    companyId ? state.isBookmarked(companyId, result.sellingMaterial._id) : false,
  );

  if (!companyId) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleBookmark(companyId, result);
      }}
      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this listing"}
      className={`shrink-0 rounded-full p-1.5 transition-colors ${
        isBookmarked
          ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
          : "text-black/40 hover:bg-black/5 hover:text-black"
      } ${className ?? ""}`}
    >
      <Bookmark className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
    </button>
  );
}
