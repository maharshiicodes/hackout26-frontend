"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Rss, MapPin, FlaskConical, AlertCircle } from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import CompanyDetailsModal, {
  type CompanyInfo,
  type SellingMaterialInfo,
} from "@/app/components/CompanyDetailsModal";

const FEED_LIMIT = 6;

type FeedItem = {
  score: number;
  relevanceScore: number;
  freshnessScore: number;
  sellingMaterial: SellingMaterialInfo & { manufacturingCompanyId: string };
  company: CompanyInfo;
};

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200/80 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="h-9 w-9 rounded-lg bg-zinc-100" />
        <div className="h-5 w-16 rounded-full bg-zinc-100" />
      </div>
      <div className="mt-4 h-4 w-2/3 rounded bg-zinc-100" />
      <div className="mt-2 h-3 w-1/3 rounded bg-zinc-100" />
      <div className="mt-2 h-3 w-1/2 rounded bg-zinc-100" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-14 rounded-full bg-zinc-100" />
        <div className="h-5 w-14 rounded-full bg-zinc-100" />
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);

  const fetchFeed = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.get("/api/feed", {
        params: { page: 1, limit: FEED_LIMIT },
      });
      setItems(response.data.results);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch-on-mount: fine here since fetchFeed only runs once (empty deps).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeed();
  }, [fetchFeed]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900">
            Feed
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Top listings recommended for your company, based on what you buy and sell.
          </p>
        </div>
        {!isLoading && !error && items.length > 0 && (
          <span className="hidden shrink-0 items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-200/70 sm:flex">
            <Rss className="h-3.5 w-3.5 text-blue-600" />
            {items.length} matches
          </span>
        )}
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: FEED_LIMIT }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600 ring-1 ring-inset ring-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white/40 px-4 py-16 text-center">
            <Rss className="h-5 w-5 text-zinc-300" />
            <p className="text-sm text-zinc-500">
              No recommendations yet. List or request a material to help us personalize your
              feed.
            </p>
          </div>
        )}

        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.sellingMaterial._id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedItem(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedItem(item);
                }}
                className="flex cursor-pointer flex-col rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_12px_28px_-18px_rgba(24,24,27,0.12)] transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-[0_1px_2px_rgba(24,24,27,0.04),0_20px_36px_-16px_rgba(37,99,235,0.2)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100/70">
                    <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <span className="shrink-0 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100/80">
                    {Math.round(item.score * 100)}% match
                  </span>
                </div>

                <div className="mt-3">
                  <p className="font-medium text-zinc-900">
                    {item.sellingMaterial.chemical.name}{" "}
                    <span className="font-normal text-zinc-400">
                      ({item.sellingMaterial.chemical.formula})
                    </span>
                  </p>
                  <p className="text-xs text-zinc-500">by {item.company.name}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-zinc-600">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.sellingMaterial.sourceLocation}</span>
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 ring-1 ring-inset ring-zinc-200/70">
                    {item.sellingMaterial.state}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 ring-1 ring-inset ring-zinc-200/70">
                    {item.sellingMaterial.cadence}
                  </span>
                  {Object.entries(item.sellingMaterial.data).map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 ring-1 ring-inset ring-zinc-200/70"
                    >
                      {key}: {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CompanyDetailsModal
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        score={selectedItem?.score ?? null}
        sellingMaterial={selectedItem?.sellingMaterial ?? null}
        company={selectedItem?.company ?? null}
      />
    </div>
  );
}
