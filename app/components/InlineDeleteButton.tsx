"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

/**
 * A trash icon that, on click, turns into an inline "Delete this listing?
 * Yes / Cancel" confirm — no modal, styled to sit in a card's corner.
 * `onDelete` should throw with a user-facing message on failure.
 */
export function InlineDeleteButton({ onDelete }: { onDelete: () => Promise<void> }) {
  const [phase, setPhase] = useState<"idle" | "confirming" | "deleting">("idle");
  const [error, setError] = useState("");

  async function handleConfirm() {
    setPhase("deleting");
    setError("");
    try {
      await onDelete();
      // On success the item is removed from its parent list and this
      // component unmounts, so no need to reset phase here.
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete. Try again.");
      setPhase("idle");
    }
  }

  if (phase === "confirming") {
    return (
      <div className="flex shrink-0 items-center gap-2 text-xs">
        <span className="text-zinc-500">Delete?</span>
        <button
          type="button"
          onClick={handleConfirm}
          className="font-medium text-red-600 hover:text-red-700"
        >
          Yes, delete
        </button>
        <button
          type="button"
          onClick={() => setPhase("idle")}
          className="font-medium text-zinc-400 hover:text-zinc-700"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (phase === "deleting") {
    return (
      <span className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-500">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Deleting…
      </span>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setPhase("confirming")}
        aria-label="Delete listing"
        className="rounded-lg p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 className="h-4 w-4" />
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
