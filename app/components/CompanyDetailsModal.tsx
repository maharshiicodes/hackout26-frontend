"use client";

import { useEffect } from "react";
import { X, Building2, Mail, Phone, MapPin, Home, Hash, FlaskConical, Truck } from "lucide-react";

export type LogisticsCompanyInfo = {
  _id: string;
  name: string;
  location: string;
  address: string;
  contactNum: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CompanyInfo = {
  _id: string;
  name: string;
  location: string;
  address: string;
  pincode: string | null;
  contactNum: string;
  email: string | null;
  // Optional because bookmarks loaded from localStorage may predate this
  // field being added to the search/feed API responses.
  availableLogistics?: LogisticsCompanyInfo[];
};

export type SellingMaterialInfo = {
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

// Shape returned by POST /api/search/selling-materials, where `company` is
// nested inside `sellingMaterial`.
export type SellingMaterialResult = {
  score: number;
  sellingMaterial: SellingMaterialInfo & {
    manufacturingCompanyId: string;
    company: CompanyInfo;
  };
};

export default function CompanyDetailsModal({
  open,
  onClose,
  score,
  sellingMaterial,
  company,
}: {
  open: boolean;
  onClose: () => void;
  score: number | null;
  sellingMaterial: SellingMaterialInfo | null;
  company: CompanyInfo | null;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !sellingMaterial || !company) return null;

  const { chemical } = sellingMaterial;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">
              <Building2 className="h-5.5 w-5.5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-black">{company.name}</h2>
              <p className="mt-0.5 text-sm text-black/50">Manufacturing company</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-black/40 hover:bg-black/5 hover:text-black"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {company.email && (
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-2 text-sm text-black/70 hover:text-blue-600"
            >
              <Mail className="h-4 w-4 shrink-0 text-black/40" />
              {company.email}
            </a>
          )}
          <a
            href={`tel:${company.contactNum}`}
            className="flex items-center gap-2 text-sm text-black/70 hover:text-blue-600"
          >
            <Phone className="h-4 w-4 shrink-0 text-black/40" />
            {company.contactNum}
          </a>
          <p className="flex items-center gap-2 text-sm text-black/70">
            <MapPin className="h-4 w-4 shrink-0 text-black/40" />
            {company.location}
          </p>
          <p className="flex items-center gap-2 text-sm text-black/70">
            <Home className="h-4 w-4 shrink-0 text-black/40" />
            {company.address}
          </p>
          {company.pincode && (
            <p className="flex items-center gap-2 text-sm text-black/70">
              <Hash className="h-4 w-4 shrink-0 text-black/40" />
              {company.pincode}
            </p>
          )}
        </div>

        {(company.availableLogistics ?? []).length > 0 && (
          <div className="mt-6 border-t border-black/10 pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-black/40">
              Available logistics partners
            </h3>
            <div className="mt-3 space-y-2.5">
              {(company.availableLogistics ?? []).map((logistics) => (
                <div
                  key={logistics._id}
                  className="flex items-start gap-3 rounded-lg bg-black/[0.03] p-3"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Truck className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-black">{logistics.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-black/60">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {logistics.location}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-black/60">
                      <Home className="h-3.5 w-3.5 shrink-0" />
                      {logistics.address}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-black/60">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {logistics.contactNum}
                    </p>
                    {logistics.email && (
                      <a
                        href={`mailto:${logistics.email}`}
                        className="mt-0.5 flex items-center gap-1 text-xs text-black/60 hover:text-blue-600"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{logistics.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-black/10 pt-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-black/40">
            Listing details
          </h3>

          <div className="mt-3 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <FlaskConical className="h-4.5 w-4.5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-black">
                  {chemical.name}{" "}
                  <span className="font-normal text-black/40">({chemical.formula})</span>
                </p>
                <p className="text-xs text-black/50">CAS {chemical.casNumber}</p>
                <p className="mt-1.5 flex items-center gap-1 text-sm text-black/60">
                  <MapPin className="h-3.5 w-3.5" />
                  {sellingMaterial.sourceLocation}
                </p>
              </div>
            </div>
            {score !== null && (
              <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {Math.round(score * 100)}% match
              </span>
            )}
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
      </div>
    </div>
  );
}
