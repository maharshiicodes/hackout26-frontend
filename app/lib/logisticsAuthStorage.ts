// Shared with app/store/logisticsAuthStore.ts, which persists
// { token, logisticsCompanyId } under this key via zustand's `persist`
// middleware. Mirrors authStorage.ts, kept separate because logistics
// companies and manufacturing companies are distinct account types with
// their own tokens.
export const LOGISTICS_AUTH_STORAGE_KEY = "logistics-auth-storage";

export function getStoredLogisticsToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOGISTICS_AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.state?.token ?? null;
  } catch {
    return null;
  }
}
