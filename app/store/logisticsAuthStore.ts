import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LOGISTICS_AUTH_STORAGE_KEY } from "@/app/lib/logisticsAuthStorage";

type LogisticsAuthState = {
  token: string | null;
  logisticsCompanyId: string | null;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setToken: (token: string, logisticsCompanyId: string) => void;
  logout: () => void;
};

export const useLogisticsAuthStore = create<LogisticsAuthState>()(
  persist(
    (set) => ({
      token: null,
      logisticsCompanyId: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setToken: (token, logisticsCompanyId) => set({ token, logisticsCompanyId }),
      logout: () => set({ token: null, logisticsCompanyId: null }),
    }),
    {
      name: LOGISTICS_AUTH_STORAGE_KEY,
      partialize: (state) => ({ token: state.token, logisticsCompanyId: state.logisticsCompanyId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
