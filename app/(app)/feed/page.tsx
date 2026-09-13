"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Loader2, MapPin, FlaskConical, AlertCircle } from "lucide-react";
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
      <h1 className="text-2xl font-semibold tracking-tight text-black">Feed</h1>
      <p className="mt-1 text-sm text-black/60">
        Top listings recommended for your company, based on what you buy and sell.
      </p>

      <div className="mt-8">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-black/40" />
          </div>
        )}

        {!isLoading && error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <p className="rounded-lg border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/50">
            No recommendations yet. List or request a material to help us personalize your feed.
          </p>
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
                className="flex cursor-pointer flex-col rounded-xl border border-black/10 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {Math.round(item.score * 100)}% match
                  </span>
                </div>

                <div className="mt-3">
                  <p className="font-medium text-black">
                    {item.sellingMaterial.chemical.name}{" "}
                    <span className="font-normal text-black/40">
                      ({item.sellingMaterial.chemical.formula})
                    </span>
                  </p>
                  <p className="text-xs text-black/50">by {item.company.name}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-sm text-black/60">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{item.sellingMaterial.sourceLocation}</span>
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize text-black/60">
                    {item.sellingMaterial.state}
                  </span>
                  <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize text-black/60">
                    {item.sellingMaterial.cadence}
                  </span>
                  {Object.entries(item.sellingMaterial.data).map(([key, value]) => (
                    <span
                      key={key}
                      className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize text-black/60"
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
