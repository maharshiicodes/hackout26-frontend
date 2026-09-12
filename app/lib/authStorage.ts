// Shared with app/store/authStore.ts, which persists { token, companyId }
// under this key via zustand's `persist` middleware. Kept separate from
// apiClient/authStore so neither has to import the other.
export const AUTH_STORAGE_KEY = "auth-storage";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw)?.state?.token ?? null;
  } catch {
    return null;
  }
}
