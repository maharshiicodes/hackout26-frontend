"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X, FlaskConical, MapPin, Loader2, PackagePlus } from "lucide-react";
import { apiClient } from "@/app/lib/apiClient";
import { DynamicAttributes, attributesToRecord, type AttributeRow } from "@/app/components/DynamicAttributes";
import { INDIAN_STATES } from "@/app/lib/indianStates";
import { UNIT_OPTIONS } from "@/app/lib/units";

type SellFormState = {
  chemicalName: string;
  chemicalFormula: string;
  casNumber: string;
  city: string;
  region: string;
  state: "" | "solid" | "liquid" | "gas";
  purity: string;
  quantity: string;
  unit: string;
};

const initialFormState: SellFormState = {
  chemicalName: "",
  chemicalFormula: "",
  casNumber: "",
  city: "",
  region: "",
  state: "",
  purity: "",
  quantity: "",
  unit: "",
};

const inputClass =
  "w-full rounded-lg border border-black/15 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20";

export default function SellProductModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formState, setFormState] = useState<SellFormState>(initialFormState);
  const [attributeRows, setAttributeRows] = useState<AttributeRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  function updateField<K extends keyof SellFormState>(field: K, value: SellFormState[K]) {
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await apiClient.post("/api/selling-materials", {
        chemical: {
          name: formState.chemicalName,
          formula: formState.chemicalFormula,
          casNumber: formState.casNumber,
        },
        sourceLocation: `${formState.city.trim()}, ${formState.region}`,
        cadence: "monthly",
        state: formState.state,
        data: {
          purity: Number(formState.purity),
          quantity: Number(formState.quantity),
          unit: formState.unit,
          ...attributesToRecord(attributeRows),
        },
      });
      setFormState(initialFormState);
      setAttributeRows([]);
      onSuccess();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        if (err.response.status === 401) {
          setErrorMessage("Your session has expired. Please log in again.");
        } else {
          setErrorMessage(err.response.data.message);
        }
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-black">
              List a material for sale
            </h2>
            <p className="mt-1 text-sm text-black/60">
              Publish a chemical your company can supply to buyers.
            </p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="chemicalName" className="mb-1.5 block text-sm font-medium text-black">
                Chemical name
              </label>
              <div className="relative">
                <FlaskConical className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
                <input
                  id="chemicalName"
                  type="text"
                  required
                  placeholder="Hydrochloric Acid"
                  value={formState.chemicalName}
                  onChange={(e) => updateField("chemicalName", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="chemicalFormula" className="mb-1.5 block text-sm font-medium text-black">
                Formula
              </label>
              <input
                id="chemicalFormula"
                type="text"
                required
                placeholder="HCl"
                value={formState.chemicalFormula}
                onChange={(e) => updateField("chemicalFormula", e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white py-2.5 px-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="casNumber" className="mb-1.5 block text-sm font-medium text-black">
              CAS number
            </label>
            <input
              id="casNumber"
              type="text"
              required
              placeholder="7647-01-0"
              value={formState.casNumber}
              onChange={(e) => updateField("casNumber", e.target.value)}
              className="w-full rounded-lg border border-black/15 bg-white py-2.5 px-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="mb-1.5 block text-sm font-medium text-black">
                City
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-black/40" />
                <input
                  id="city"
                  type="text"
                  required
                  placeholder="Ahmedabad"
                  value={formState.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="region" className="mb-1.5 block text-sm font-medium text-black">
                State
              </label>
              <select
                id="region"
                required
                value={formState.region}
                onChange={(e) => updateField("region", e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white py-2.5 px-3 text-sm text-black outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="" disabled>
                  Select state
                </option>
                {INDIAN_STATES.map((stateName) => (
                  <option key={stateName} value={stateName}>
                    {stateName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="state" className="mb-1.5 block text-sm font-medium text-black">
                Physical state
              </label>
              <select
                id="state"
                required
                value={formState.state}
                onChange={(e) => updateField("state", e.target.value as SellFormState["state"])}
                className="w-full rounded-lg border border-black/15 bg-white py-2.5 px-3 text-sm text-black outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="" disabled>
                  Select state
                </option>
                <option value="solid">Solid</option>
                <option value="liquid">Liquid</option>
                <option value="gas">Gas</option>
              </select>
            </div>

            <div>
              <label htmlFor="cadence" className="mb-1.5 block text-sm font-medium text-black">
                Cadence
              </label>
              <select
                id="cadence"
                disabled
                value="monthly"
                className="w-full cursor-not-allowed rounded-lg border border-black/15 bg-black/5 py-2.5 px-3 text-sm text-black/60 outline-none"
              >
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="purity" className="mb-1.5 block text-sm font-medium text-black">
                Purity (%)
              </label>
              <input
                id="purity"
                type="number"
                step="any"
                min="0"
                max="100"
                required
                placeholder="99"
                value={formState.purity}
                onChange={(e) => updateField("purity", e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white py-2.5 px-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="mb-1.5 block text-sm font-medium text-black">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                step="any"
                min="0"
                required
                placeholder="20"
                value={formState.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white py-2.5 px-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            <div>
              <label htmlFor="unit" className="mb-1.5 block text-sm font-medium text-black">
                Unit
              </label>
              <select
                id="unit"
                required
                value={formState.unit}
                onChange={(e) => updateField("unit", e.target.value)}
                className="w-full rounded-lg border border-black/15 bg-white py-2.5 px-3 text-sm text-black outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              >
                <option value="" disabled>
                  Select unit
                </option>
                {UNIT_OPTIONS.map((unitOption) => (
                  <option key={unitOption} value={unitOption}>
                    {unitOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DynamicAttributes rows={attributeRows} onChange={setAttributeRows} />

          {errorMessage && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errorMessage}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-black/60 hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Listing…
                </>
              ) : (
                <>
                  <PackagePlus className="h-4 w-4" />
                  List material
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
