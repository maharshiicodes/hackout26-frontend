"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  Mail,
  MapPin,
  Home,
  Phone,
  FlaskConical,
  PackagePlus,
  ShoppingCart,
  Loader2,
  AlertCircle,
  CheckCircle2,
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
        <Loader2 className="h-6 w-6 animate-spin text-black/40" />
      </div>
    );
  }

  if (profileError && !company) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {profileError}
        </div>
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-black">Profile</h1>
      <p className="mt-1 text-sm text-black/60">
        Your company details and marketplace activity.
      </p>

      {successMessage && (
        <div className="mt-6 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2.5 text-sm text-blue-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">
            <Building2 className="h-5.5 w-5.5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-black">{company.name}</h2>
            <p className="text-sm text-black/50">Manufacturing company</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {company.email && (
            <p className="flex items-center gap-2 text-sm text-black/70">
              <Mail className="h-4 w-4 shrink-0 text-black/40" />
              {company.email}
            </p>
          )}
          <p className="flex items-center gap-2 text-sm text-black/70">
            <Phone className="h-4 w-4 shrink-0 text-black/40" />
            {company.contactNum}
          </p>
          <p className="flex items-center gap-2 text-sm text-black/70">
            <MapPin className="h-4 w-4 shrink-0 text-black/40" />
            {company.location}
          </p>
          <p className="flex items-center gap-2 text-sm text-black/70">
            <Home className="h-4 w-4 shrink-0 text-black/40" />
            {company.address}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsSellModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PackagePlus className="h-4.5 w-4.5" />
          Sell product
        </button>
        <button
          type="button"
          onClick={() => setIsBuyModalOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          Buy product
        </button>
      </div>

      <section className="mt-10">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-black/40">
          Selling ({company.sellingMaterials.length})
        </h3>
        {company.sellingMaterials.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-black/15 px-4 py-6 text-center text-sm text-black/50">
            You haven&apos;t listed any materials for sale yet.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {company.sellingMaterials.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        {item.chemical.name}{" "}
                        <span className="font-normal text-black/40">({item.chemical.formula})</span>
                      </p>
                      <p className="text-xs text-black/50">CAS {item.chemical.casNumber}</p>
                      <p className="mt-1.5 flex items-center gap-1 text-sm text-black/60">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.sourceLocation}
                      </p>
                    </div>
                  </div>
                  <InlineDeleteButton onDelete={() => handleDeleteSelling(item._id)} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize text-black/60">
                    {item.state}
                  </span>
                  <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs capitalize text-black/60">
                    {item.cadence}
                  </span>
                  {Object.entries(item.data).map(([key, value]) => (
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
      </section>

      <section className="mt-10">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-black/40">
          Buying ({company.buyingMaterials.length})
        </h3>
        {company.buyingMaterials.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-black/15 px-4 py-6 text-center text-sm text-black/50">
            You don&apos;t have any active buy requests yet.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {company.buyingMaterials.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-black">
                        {item.chemical.name}{" "}
                        <span className="font-normal text-black/40">({item.chemical.formula})</span>
                      </p>
                      <p className="text-xs text-black/50">CAS {item.chemical.casNumber}</p>
                      <p className="mt-1.5 flex items-center gap-1 text-sm text-black/60">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.reqLocation}
                      </p>
                    </div>
                  </div>
                  <InlineDeleteButton onDelete={() => handleDeleteBuying(item._id)} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(item.data).map(([key, value]) => (
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
