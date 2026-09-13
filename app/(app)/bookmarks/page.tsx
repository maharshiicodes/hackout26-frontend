"use client";

import { useState } from "react";
import { Bookmark, Loader2, MapPin, FlaskConical } from "lucide-react";
import { useAuthStore } from "@/app/store/authStore";
import { useBookmarkStore } from "@/app/store/bookmarkStore";
import { BookmarkButton } from "@/app/components/BookmarkButton";
import CompanyDetailsModal, {
  type SellingMaterialResult,
} from "@/app/components/CompanyDetailsModal";

export default function BookmarksPage() {
  const companyId = useAuthStore((state) => state.companyId);
  const bookmarkHasHydrated = useBookmarkStore((state) => state.hasHydrated);
  const bookmarks = useBookmarkStore((state) =>
    companyId ? state.bookmarksByCompany[companyId] ?? [] : [],
  );

  const [selectedResult, setSelectedResult] = useState<SellingMaterialResult | null>(null);

  if (!bookmarkHasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900">
            Bookmarks
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Listings you&apos;ve saved from Dashboard search results.
          </p>
        </div>
        {bookmarks.length > 0 && (
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200/70 sm:flex">
            <Bookmark className="h-3.5 w-3.5 text-blue-600" />
            {bookmarks.length} saved
          </span>
        )}
      </div>

      <div className="mt-8">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 bg-white/40 px-4 py-16 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100">
              <Bookmark className="h-5 w-5 text-zinc-400" />
            </div>
            <p className="max-w-sm text-sm text-zinc-500">
              You haven&apos;t bookmarked anything yet. Search for materials on the Dashboard
              and bookmark the ones you want to come back to.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((result) => {
              const { score, sellingMaterial } = result;
              return (
                <div
                  key={sellingMaterial._id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedResult(result)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelectedResult(result);
                  }}
                  className="cursor-pointer rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_12px_28px_-18px_rgba(24,24,27,0.12)] transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_1px_2px_rgba(24,24,27,0.04),0_20px_36px_-16px_rgba(37,99,235,0.2)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100/70">
                        <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-900">
                          {sellingMaterial.chemical.name}{" "}
                          <span className="font-normal text-zinc-400">
                            ({sellingMaterial.chemical.formula})
                          </span>
                        </p>
                        <p className="text-xs text-zinc-500">
                          CAS {sellingMaterial.chemical.casNumber} · by{" "}
                          {sellingMaterial.company.name}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-sm text-zinc-600">
                          <MapPin className="h-3.5 w-3.5" />
                          {sellingMaterial.sourceLocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100/80">
                        {Math.round(score * 100)}% match
                      </span>
                      <BookmarkButton result={result} />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 ring-1 ring-inset ring-zinc-200/70">
                      {sellingMaterial.state}
                    </span>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 ring-1 ring-inset ring-zinc-200/70">
                      {sellingMaterial.cadence}
                    </span>
                    {Object.entries(sellingMaterial.data).map(([key, value]) => (
                      <span
                        key={key}
                        className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 ring-1 ring-inset ring-zinc-200/70"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CompanyDetailsModal
        open={!!selectedResult}
        onClose={() => setSelectedResult(null)}
        score={selectedResult?.score ?? null}
        sellingMaterial={selectedResult?.sellingMaterial ?? null}
        company={selectedResult?.sellingMaterial.company ?? null}
      />
    </div>
  );
}
