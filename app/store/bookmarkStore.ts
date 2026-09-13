import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SellingMaterialResult } from "@/app/components/CompanyDetailsModal";

// Bookmarked search results, persisted to localStorage and namespaced by
// manufacturing company id so a different company logging in on the same
// browser sees their own (empty) list rather than the previous company's.
export const BOOKMARK_STORAGE_KEY = "bookmark-storage";

type BookmarkState = {
  bookmarksByCompany: Record<string, SellingMaterialResult[]>;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  isBookmarked: (companyId: string, materialId: string) => boolean;
  toggleBookmark: (companyId: string, item: SellingMaterialResult) => void;
  removeBookmark: (companyId: string, materialId: string) => void;
};

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarksByCompany: {},
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      isBookmarked: (companyId, materialId) =>
        (get().bookmarksByCompany[companyId] ?? []).some(
          (item) => item.sellingMaterial._id === materialId,
        ),
      toggleBookmark: (companyId, item) => {
        const existing = get().bookmarksByCompany[companyId] ?? [];
        const materialId = item.sellingMaterial._id;
        const alreadyBookmarked = existing.some((b) => b.sellingMaterial._id === materialId);
        const updated = alreadyBookmarked
          ? existing.filter((b) => b.sellingMaterial._id !== materialId)
          : [item, ...existing];
        set({ bookmarksByCompany: { ...get().bookmarksByCompany, [companyId]: updated } });
      },
      removeBookmark: (companyId, materialId) => {
        const existing = get().bookmarksByCompany[companyId] ?? [];
        set({
          bookmarksByCompany: {
            ...get().bookmarksByCompany,
            [companyId]: existing.filter((b) => b.sellingMaterial._id !== materialId),
          },
        });
      },
    }),
    {
      name: BOOKMARK_STORAGE_KEY,
      partialize: (state) => ({ bookmarksByCompany: state.bookmarksByCompany }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
