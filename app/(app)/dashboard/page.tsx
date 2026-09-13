"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Loader2,
  MapPin,
  FlaskConical,
  AlertCircle,
  CheckCircle2,
  PackagePlus,
  Layers,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import { useAuthStore } from "@/app/store/authStore";
import SellProductModal from "@/app/components/SellProductModal";
import CompanyDetailsModal, {
  type SellingMaterialResult,
} from "@/app/components/CompanyDetailsModal";
import { BookmarkButton } from "@/app/components/BookmarkButton";

export default function DashboardPage() {
  const company = useAuthStore((state) => state.company);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [casNumber, setCasNumber] = useState("");
  const [results, setResults] = useState<SellingMaterialResult[]>([]);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SellingMaterialResult | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Only needed for the greeting's company name - skip if already cached
    // from an earlier visit (e.g. the Profile page) this session.
    if (!useAuthStore.getState().company) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    fetchProfile();
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6">
      <motion.div
        layout
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`flex flex-col ${
          hasSearched ? "justify-start pt-10" : "flex-1 justify-center"
        }`}
      >
        <AnimatePresence mode="sync">
          {!hasSearched && (
            <motion.div
              key="greeting"
              initial={{ opacity: 0, y: 12, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mb-6 text-center"
            >
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900">
                Welcome back{company ? `, ${company.name}` : ""}
              </h1>
              <p className="mt-2 text-sm text-zinc-500">
                Search for materials buyers need, or list what your company can supply.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {successMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-700 ring-1 ring-inset ring-blue-100">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMessage}
          </div>
        )}

        <motion.div
          layout
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className={`relative mx-auto w-full ${hasSearched ? "max-w-4xl" : "max-w-2xl"}`}
        >
          <AnimatePresence>
            {!hasSearched && (
              <motion.div
                key="search-glow"
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-r from-blue-500/70 via-blue-600/60 to-indigo-500/70 blur-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.12, 0.22, 0.12], scale: [0.98, 1.02, 0.98] }}
                exit={{ opacity: 0 }}
                transition={{
                  opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
              />
            )}
          </AnimatePresence>

          <form onSubmit={handleSearch} className="relative w-full">
            <Search
              className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-zinc-400 transition-all duration-300 ${
                hasSearched ? "left-3 h-4.5 w-4.5" : "left-5 h-5 w-5"
              }`}
            />
            <input
              type="text"
              placeholder='Describe what you need, e.g. "hydrochloric acid CAS 7647-01-0, 99% purity"'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full border bg-white text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 ${
                hasSearched
                  ? "rounded-xl border-zinc-200 py-3 pl-10 pr-24 text-sm shadow-sm"
                  : "rounded-3xl border-zinc-200 py-5 pl-14 pr-32 text-base shadow-[0_1px_2px_rgba(24,24,27,0.04),0_20px_44px_-20px_rgba(37,99,235,0.28)]"
              }`}
            />
            <button
              type="submit"
              disabled={isSearching}
              className={`absolute flex items-center gap-1.5 bg-blue-600 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${
                hasSearched
                  ? "right-1.5 top-1.5 rounded-lg px-3 py-1.5 text-sm"
                  : "right-2.5 top-2.5 rounded-2xl px-4 py-2.5 text-sm"
              }`}
            >
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </button>
          </form>
        </motion.div>

        {/* Fills the space around the search bar with the company's actual
            snapshot and a real shortcut, instead of leaving it floating
            alone on an empty page. */}
        <AnimatePresence>
          {!hasSearched && (
            <motion.div
              key="snapshot"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
            >
              <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_12px_28px_-18px_rgba(24,24,27,0.14)] backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100/70">
                  <Layers className="h-4 w-4" />
                </div>
                <p className="font-heading mt-3 text-2xl tracking-tight text-zinc-900">
                  {company?.sellingMaterials.length ?? "–"}
                </p>
                <p className="text-xs text-zinc-500">Materials listed</p>
              </div>
              <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_12px_28px_-18px_rgba(24,24,27,0.14)] backdrop-blur-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100/70">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <p className="font-heading mt-3 text-2xl tracking-tight text-zinc-900">
                  {company?.buyingMaterials.length ?? "–"}
                </p>
                <p className="text-xs text-zinc-500">Active buy requests</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSellModalOpen(true)}
                className="group flex flex-col justify-between rounded-2xl border border-dashed border-zinc-300 bg-white/40 p-4 text-left transition-colors hover:border-blue-400 hover:bg-blue-50/40"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors group-hover:bg-blue-600">
                  <PackagePlus className="h-4 w-4" />
                </div>
                <span className="mt-3 flex items-center gap-1 text-sm font-medium text-zinc-700 group-hover:text-blue-700">
                  List a material
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mt-8 pb-10"
        >
          {searchError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600 ring-1 ring-inset ring-red-100">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {searchError}
            </div>
          )}

          {!searchError && !isSearching && results.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-zinc-300 bg-white/40 px-4 py-12 text-center">
              <Search className="h-5 w-5 text-zinc-300" />
              <p className="text-sm text-zinc-500">
                No matching listings found{casNumber ? ` for CAS ${casNumber}` : ""}.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Showing sellers for CAS {casNumber}
              </p>
              {results.map((result) => {
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
                            CAS {sellingMaterial.chemical.casNumber}
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
        </motion.div>
      )}

      <SellProductModal
        open={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSuccess={handleSellSuccess}
      />
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
