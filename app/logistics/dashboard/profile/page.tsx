"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Building2,
  Mail,
  MapPin,
  Home,
  Phone,
  Hash,
  Plus,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { logisticsApiClient } from "@/app/lib/logisticsApiClient";
import { useLogisticsProfileStore } from "@/app/store/logisticsProfileStore";
import AddPincodesModal from "@/app/components/AddPincodesModal";

function toErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message;
  }
  return "Something went wrong. Please try again.";
}

export default function LogisticsProfilePage() {
  const company = useLogisticsProfileStore((state) => state.company);
  const isLoadingProfile = useLogisticsProfileStore((state) => state.isLoadingProfile);
  const profileError = useLogisticsProfileStore((state) => state.profileError);
  const fetchProfile = useLogisticsProfileStore((state) => state.fetchProfile);

  const pincodes = useLogisticsProfileStore((state) => state.pincodes);
  const pincodesTotal = useLogisticsProfileStore((state) => state.pincodesTotal);
  const pincodesPage = useLogisticsProfileStore((state) => state.pincodesPage);
  const hasMorePincodes = useLogisticsProfileStore((state) => state.hasMorePincodes);
  const isLoadingPincodes = useLogisticsProfileStore((state) => state.isLoadingPincodes);
  const isLoadingMorePincodes = useLogisticsProfileStore((state) => state.isLoadingMorePincodes);
  const pincodesError = useLogisticsProfileStore((state) => state.pincodesError);
  const fetchPincodes = useLogisticsProfileStore((state) => state.fetchPincodes);
  const removePincode = useLogisticsProfileStore((state) => state.removePincode);

  const [deletingPincode, setDeletingPincode] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Skip re-fetching if we already have data cached from an earlier visit
    // this session (e.g. navigating back from the dashboard).
    if (!useLogisticsProfileStore.getState().company) {
      fetchProfile();
    }
    if (useLogisticsProfileStore.getState().pincodes.length === 0) {
      fetchPincodes(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddSuccess(result: { added: number; duplicates: number }) {
    setIsAddModalOpen(false);
    const parts = [`${result.added} pincode${result.added === 1 ? "" : "s"} added`];
    if (result.duplicates > 0) {
      parts.push(`${result.duplicates} already existed`);
    }
    setSuccessMessage(parts.join(", ") + ".");
    fetchPincodes(1);
    setTimeout(() => setSuccessMessage(""), 4000);
  }

  async function handleDeletePincode(pincode: string) {
    setDeletingPincode(pincode);
    setDeleteError("");
    try {
      await logisticsApiClient.delete(`/api/logistics/serviceability/pincodes/${pincode}`);
      removePincode(pincode);
    } catch (err) {
      setDeleteError(toErrorMessage(err));
    } finally {
      setDeletingPincode(null);
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
      <Link
        href="/logistics/dashboard"
        className="flex w-fit items-center gap-1.5 text-sm font-medium text-black/50 hover:text-black"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-semibold tracking-tight text-black">Profile</h1>
      <p className="mt-1 text-sm text-black/60">
        Your company details and serviceable pincodes.
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
            <p className="text-sm text-black/50">Logistics company</p>
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

      <section className="mt-10">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-black/40">
            Serviceable pincodes ({pincodesTotal})
          </h3>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add pincodes
          </button>
        </div>

        {(pincodesError || deleteError) && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {pincodesError || deleteError}
          </div>
        )}

        {isLoadingPincodes ? (
          <div className="mt-3 flex items-center justify-center rounded-xl border border-black/10 bg-white py-10">
            <Loader2 className="h-5 w-5 animate-spin text-black/40" />
          </div>
        ) : pincodes.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-black/15 px-4 py-6 text-center text-sm text-black/50">
            No serviceable pincodes yet. Add pincodes to start receiving shipments in those areas.
          </p>
        ) : (
          <div className="mt-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {pincodes.map((entry) => (
                <span
                  key={entry.pincode}
                  className="flex items-center gap-1.5 rounded-full bg-black/5 py-1 pl-3 pr-1.5 text-sm text-black/70"
                >
                  <Hash className="h-3.5 w-3.5 text-black/40" />
                  {entry.pincode}
                  <button
                    type="button"
                    onClick={() => handleDeletePincode(entry.pincode)}
                    disabled={deletingPincode === entry.pincode}
                    aria-label={`Remove pincode ${entry.pincode}`}
                    className="rounded-full p-0.5 text-black/40 hover:bg-red-100 hover:text-red-600 disabled:cursor-not-allowed"
                  >
                    {deletingPincode === entry.pincode ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </button>
                </span>
              ))}
            </div>

            {hasMorePincodes && (
              <button
                type="button"
                onClick={() => fetchPincodes(pincodesPage + 1)}
                disabled={isLoadingMorePincodes}
                className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMorePincodes && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Load more
              </button>
            )}
          </div>
        )}
      </section>

      <AddPincodesModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
}
