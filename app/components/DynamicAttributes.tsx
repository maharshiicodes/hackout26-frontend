"use client";

import { Plus, X } from "lucide-react";

export type AttributeRow = { id: string; key: string; value: string };

/**
 * Lets a user attach arbitrary extra key/value pairs to a listing (e.g.
 * "temperature: 25"), on top of the form's fixed fields. Used by both the
 * Sell and Buy modals, since the backend's `data` object is fully freeform.
 */
export function DynamicAttributes({
  rows,
  onChange,
}: {
  rows: AttributeRow[];
  onChange: (rows: AttributeRow[]) => void;
}) {
  function updateRow(id: string, field: "key" | "value", value: string) {
    onChange(rows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  }

  function addRow() {
    onChange([...rows, { id: crypto.randomUUID(), key: "", value: "" }]);
  }

  function removeRow(id: string) {
    onChange(rows.filter((row) => row.id !== id));
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="block text-sm font-medium text-black">Additional properties</span>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add property
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-xs text-black/40">No additional properties added.</p>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Property, e.g. temperature"
                value={row.key}
                onChange={(e) => updateRow(row.id, "key", e.target.value)}
                className="w-1/2 rounded-lg border border-black/15 bg-white py-2 px-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
              <input
                type="text"
                placeholder="Value, e.g. 25"
                value={row.value}
                onChange={(e) => updateRow(row.id, "value", e.target.value)}
                className="w-1/2 rounded-lg border border-black/15 bg-white py-2 px-3 text-sm text-black placeholder:text-black/35 outline-none transition-colors focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              />
              <button
                type="button"
                onClick={() => removeRow(row.id)}
                aria-label="Remove property"
                className="shrink-0 rounded-lg p-2 text-black/40 hover:bg-black/5 hover:text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Converts attribute rows into a plain object, coercing numeric-looking values to numbers. */
export function attributesToRecord(rows: AttributeRow[]): Record<string, string | number> {
  const record: Record<string, string | number> = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (!key) continue;
    const trimmedValue = row.value.trim();
    const numeric = Number(trimmedValue);
    record[key] = trimmedValue !== "" && !Number.isNaN(numeric) ? numeric : trimmedValue;
  }
  return record;
}
