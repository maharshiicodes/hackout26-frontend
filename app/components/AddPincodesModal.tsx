"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { X, MapPin, Loader2 } from "lucide-react";
import { logisticsApiClient } from "@/app/lib/logisticsApiClient";

type AddPincodesResponse = {
  message: string;
  added: number;
  duplicates: number;
  totalProcessed: number;
};

// Splits the free-text textarea input on commas, whitespace, and newlines so
// pincodes can be pasted in any of those layouts, then dedupes.
function parsePincodes(raw: string): string[] {
  const tokens = raw
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter(Boolean);
  return Array.from(new Set(tokens));
}

export default function AddPincodesModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: (result: AddPincodesResponse) => void;
}) {
  const [rawInput, setRawInput] = useState("");
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

  const pincodes = parsePincodes(rawInput);
  const invalidPincodes = pincodes.filter((p) => !/^\d{6}$/.test(p));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (pincodes.length === 0) {
      setErrorMessage("Enter at least one pincode.");
      return;
    }
    if (invalidPincodes.length > 0) {
      setErrorMessage(
        `Invalid pincodes: ${invalidPincodes.join(", ")}. Pincodes must be exactly 6 digits.`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await logisticsApiClient.post<AddPincodesResponse>(
        "/api/logistics/serviceability/pincodes",
        { pincodes },
      );
      setRawInput("");
      onSuccess(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
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
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-black">
              Add serviceable pincodes
            </h2>
            <p className="mt-1 text-sm text-black/60">
              Separate multiple pincodes with commas, spaces, or new lines.
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
          <div>
            <label htmlFor="pincodes" className="mb-1.5 block text-sm font-medium text-black">
              Pincodes
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-4.5 w-4.5 text-black/40" />
              <textarea
                id="pincodes"
                required
                rows={4}
                placeholder={"380001, 380002\n380003"}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                className="w-full resize-none rounded-lg border border-black/15 bg-white py-2.5 pl-10 pr-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
            {pincodes.length > 0 && (
              <p className="mt-1.5 text-xs text-black/50">
                {pincodes.length} pincode{pincodes.length === 1 ? "" : "s"} detected
              </p>
            )}
          </div>

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
                  Adding…
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4" />
                  Add pincodes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
