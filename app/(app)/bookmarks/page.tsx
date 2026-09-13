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
        <Loader2 className="h-6 w-6 animate-spin text-black/40" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-black">Bookmarks</h1>
      <p className="mt-1 text-sm text-black/60">
        Listings you&apos;ve saved from Dashboard search results.
      </p>

      <div className="mt-8">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-black/15 px-4 py-12 text-center">
            <Bookmark className="h-6 w-6 text-black/30" />
            <p className="text-sm text-black/50">
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
                  className="cursor-pointer rounded-xl border border-black/10 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                        <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">
                          {sellingMaterial.chemical.name}{" "}
                          <span className="font-normal text-black/40">
                            ({sellingMaterial.chemical.formula})
                          </span>
                        </p>
                        <p className="text-xs text-black/50">
                          CAS {sellingMaterial.chemical.casNumber} · by{" "}
                          {sellingMaterial.company.name}
                        </p>
                        <p className="mt-1.5 flex items-center gap-1 text-sm text-black/60">
                          <MapPin className="h-3.5 w-3.5" />
                          {sellingMaterial.sourceLocation}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {Math.round(score * 100)}% match
                      </span>
                      <BookmarkButton result={result} />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize text-black/60">
                      {sellingMaterial.state}
                    </span>
                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize text-black/60">
                      {sellingMaterial.cadence}
                    </span>
                    {Object.entries(sellingMaterial.data).map(([key, value]) => (
                      <span
                        key={key}
                        className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize text-black/60"
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
