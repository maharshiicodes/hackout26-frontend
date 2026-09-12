"use client";

import { useEffect } from "react";
import { X, Building2, Mail, Phone, MapPin, Home, FlaskConical } from "lucide-react";

export type SellingMaterialResult = {
  score: number;
  sellingMaterial: {
    _id: string;
    manufacturingCompanyId: string;
    sourceLocation: string;
    cadence: string;
    state: string;
    data: Record<string, string | number>;
    chemical: {
      name: string;
      formula: string;
      casNumber: string;
    };
    company: {
      _id: string;
      name: string;
      location: string;
      address: string;
      contactNum: string;
      email: string | null;
    };
  };
};

export default function CompanyDetailsModal({
  open,
  onClose,
  result,
}: {
  open: boolean;
  onClose: () => void;
  result: SellingMaterialResult | null;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !result) return null;

  const { sellingMaterial, score } = result;
  const { company, chemical } = sellingMaterial;

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
        </div>

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
      </div>
    </div>
  );
}
