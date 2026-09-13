"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  MapPin,
  Home,
  Hash,
  Phone,
  FlaskConical,
  PackagePlus,
  ShoppingCart,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import { useAuthStore } from "@/app/store/authStore";
import SellProductModal from "@/app/components/SellProductModal";
import BuyProductModal from "@/app/components/BuyProductModal";
import { InlineDeleteButton } from "@/app/components/InlineDeleteButton";

function toErrorMessage(err: unknown): never {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    throw new Error(err.response.data.message);
  }
  throw new Error("Something went wrong. Please try again.");
}

export default function ProfilePage() {
  const company = useAuthStore((state) => state.company);
  const isLoadingProfile = useAuthStore((state) => state.isLoadingProfile);
  const profileError = useAuthStore((state) => state.profileError);
  const fetchProfile = useAuthStore((state) => state.fetchProfile);
  const removeSellingMaterial = useAuthStore((state) => state.removeSellingMaterial);
  const removeBuyingMaterial = useAuthStore((state) => state.removeBuyingMaterial);

  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Skip the fetch if we already have a cached profile from an earlier
    // visit this session (e.g. navigating back from Dashboard) - only the
    // Sell/Buy success handlers below force a fresh fetch after that.
    if (!useAuthStore.getState().company) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSellSuccess() {
    setIsSellModalOpen(false);
    setSuccessMessage("Your material was listed successfully.");
    fetchProfile();
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  function handleBuySuccess() {
    setIsBuyModalOpen(false);
    setSuccessMessage("Your buy request was submitted successfully.");
    fetchProfile();
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  async function handleDeleteSelling(id: string) {
    try {
      await apiClient.delete(`/api/selling-materials/${id}`);
      removeSellingMaterial(id);
    } catch (err) {
      toErrorMessage(err);
    }
  }

  async function handleDeleteBuying(id: string) {
    try {
      await apiClient.delete(`/api/buying-materials/${id}`);
      removeBuyingMaterial(id);
    } catch (err) {
      toErrorMessage(err);
    }
  }

  if (isLoadingProfile && !company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (profileError && !company) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600 ring-1 ring-inset ring-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {profileError}
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-heading text-2xl font-semibold tracking-tight text-zinc-900">
        Profile
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Your company details and marketplace activity.
      </p>

      {successMessage && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-700 ring-1 ring-inset ring-blue-100">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(24,24,27,0.04),0_16px_36px_-20px_rgba(24,24,27,0.16)]">
        <div className="h-16 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-500" />
        <div className="px-6 pb-6">
          <div className="-mt-8 flex items-end justify-between gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-semibold text-blue-600 shadow-md ring-4 ring-white">
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div className="mb-1 flex shrink-0 gap-4 text-right">
              <div>
                <p className="font-heading text-lg leading-none text-zinc-900">
                  {company.sellingMaterials.length}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-400">Selling</p>
              </div>
              <div>
                <p className="font-heading text-lg leading-none text-zinc-900">
                  {company.buyingMaterials.length}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-400">Buying</p>
              </div>
            </div>
          </div>

          <h2 className="mt-3 text-lg font-semibold text-zinc-900">{company.name}</h2>
          <p className="text-sm text-zinc-400">Manufacturing company</p>

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-zinc-100 pt-5 sm:grid-cols-2">
            {company.email && (
              <p className="flex items-center gap-2 text-sm text-zinc-600">
                <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                {company.email}
              </p>
            )}
            <p className="flex items-center gap-2 text-sm text-zinc-600">
              <Phone className="h-4 w-4 shrink-0 text-zinc-400" />
              {company.contactNum}
            </p>
            <p className="flex items-center gap-2 text-sm text-zinc-600">
              <MapPin className="h-4 w-4 shrink-0 text-zinc-400" />
              {company.location}
            </p>
            <p className="flex items-center gap-2 text-sm text-zinc-600">
              <Home className="h-4 w-4 shrink-0 text-zinc-400" />
              {company.address}
            </p>
            {company.pincode && (
              <p className="flex items-center gap-2 text-sm text-zinc-600">
                <Hash className="h-4 w-4 shrink-0 text-zinc-400" />
                {company.pincode}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsSellModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <PackagePlus className="h-4.5 w-4.5" />
          Sell product
        </button>
        <button
          type="button"
          onClick={() => setIsBuyModalOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          Buy product
        </button>
      </div>

      <section className="mt-10">
        <div className="flex items-center gap-2.5">
          <Layers className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Selling
          </h3>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
            {company.sellingMaterials.length}
          </span>
        </div>
        {company.sellingMaterials.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-zinc-300 bg-white/40 px-4 py-8 text-center text-sm text-zinc-500">
            You haven&apos;t listed any materials for sale yet.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {company.sellingMaterials.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_10px_24px_-18px_rgba(24,24,27,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100/70">
                      <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">
                        {item.chemical.name}{" "}
                        <span className="font-normal text-zinc-400">
                          ({item.chemical.formula})
                        </span>
                      </p>
                      <p className="text-xs text-zinc-500">CAS {item.chemical.casNumber}</p>
                      <p className="mt-1.5 flex items-center gap-1 text-sm text-zinc-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.sourceLocation}
                      </p>
                    </div>
                  </div>
                  <InlineDeleteButton onDelete={() => handleDeleteSelling(item._id)} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 ring-1 ring-inset ring-zinc-200/70">
                    {item.state}
                  </span>
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs capitalize text-zinc-600 ring-1 ring-inset ring-zinc-200/70">
                    {item.cadence}
                  </span>
                  {Object.entries(item.data).map(([key, value]) => (
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
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2.5">
          <ShoppingCart className="h-4 w-4 text-zinc-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Buying
          </h3>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500">
            {company.buyingMaterials.length}
          </span>
        </div>
        {company.buyingMaterials.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-zinc-300 bg-white/40 px-4 py-8 text-center text-sm text-zinc-500">
            You don&apos;t have any active buy requests yet.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {company.buyingMaterials.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(24,24,27,0.04),0_10px_24px_-18px_rgba(24,24,27,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100/70">
                      <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">
                        {item.chemical.name}{" "}
                        <span className="font-normal text-zinc-400">
                          ({item.chemical.formula})
                        </span>
                      </p>
                      <p className="text-xs text-zinc-500">CAS {item.chemical.casNumber}</p>
                      <p className="mt-1.5 flex items-center gap-1 text-sm text-zinc-600">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.reqLocation}
                        {item.reqPincode && ` (${item.reqPincode})`}
                      </p>
                    </div>
                  </div>
                  <InlineDeleteButton onDelete={() => handleDeleteBuying(item._id)} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(item.data).map(([key, value]) => (
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
      </section>

      <SellProductModal
        open={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSuccess={handleSellSuccess}
      />
      <BuyProductModal
        open={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onSuccess={handleBuySuccess}
      />
    </div>
  );
}
