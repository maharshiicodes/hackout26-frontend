"use client";

import { useState } from "react";
import axios from "axios";
import {
  Search,
  Loader2,
  PackagePlus,
  MapPin,
  FlaskConical,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import SellProductModal from "@/app/components/SellProductModal";

type SellingMaterialResult = {
  score: number;
  sellingMaterial: {
    _id: string;
    sourceLocation: string;
    cadence: string;
    state: string;
    data: Record<string, string | number>;
    chemical: {
      name: string;
      formula: string;
      casNumber: string;
    };
  };
};

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [casNumber, setCasNumber] = useState("");
  const [results, setResults] = useState<SellingMaterialResult[]>([]);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError("");
    setHasSearched(true);

    try {
      const response = await apiClient.post("/api/search/selling-materials", {
        query,
        topK: 10,
      });
      setCasNumber(response.data.casNumber);
      setResults(response.data.results);
    } catch (err) {
      setResults([]);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setSearchError(err.response.data.message);
      } else {
        setSearchError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSearching(false);
    }
  }

  function handleSellSuccess() {
    setIsSellModalOpen(false);
    setSuccessMessage("Your material was listed successfully.");
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-black">Dashboard</h1>
      <p className="mt-1 text-sm text-black/60">
        Search for materials buyers need, or list what your company can supply.
      </p>

      {successMessage && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
          <input
            type="text"
            placeholder='Describe what you need, e.g. "hydrochloric acid CAS 7647-01-0, 99% purity"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-black/15 bg-white py-3 pl-10 pr-24 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1.5 top-1.5 flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </button>
        </form>

        {/*<button
          type="button"
          onClick={() => setIsSellModalOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-blue-600 px-4 py-3 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          <PackagePlus className="h-4.5 w-4.5 " />
          Sell product
        </button>*/}
      </div>

      <div className="mt-8">
        {searchError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {searchError}
          </div>
        )}

        {!searchError && hasSearched && !isSearching && results.length === 0 && (
          <p className="rounded-lg border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/50">
            No matching listings found{casNumber ? ` for CAS ${casNumber}` : ""}.
          </p>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-black/40">
              Showing sellers for CAS {casNumber}
            </p>
            {results.map(({ score, sellingMaterial }) => (
              <div
                key={sellingMaterial._id}
                className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
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
                        CAS {sellingMaterial.chemical.casNumber}
                      </p>
                      <p className="mt-1.5 flex items-center gap-1 text-sm text-black/60">
                        <MapPin className="h-3.5 w-3.5" />
                        {sellingMaterial.sourceLocation}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                    {Math.round(score * 100)}% match
                  </span>
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
            ))}
          </div>
        )}
      </div>

      <SellProductModal
        open={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSuccess={handleSellSuccess}
      />
    </div>
  );
}
