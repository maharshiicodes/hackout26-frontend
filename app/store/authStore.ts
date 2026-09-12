import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { apiClient } from "@/app/lib/apiClient";
import { AUTH_STORAGE_KEY } from "@/app/lib/authStorage";

export type MaterialChemical = {
  _id: string;
  name: string;
  formula: string;
  casNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type SellingMaterialItem = {
  _id: string;
  sourceLocation: string;
  cadence: string;
  state: string;
  data: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
  chemical: MaterialChemical;
};

export type BuyingMaterialItem = {
  _id: string;
  reqLocation: string;
  data: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
  chemical: MaterialChemical;
};

export type CompanyProfile = {
  _id: string;
  name: string;
  location: string;
  address: string;
  contactNum: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  sellingMaterials: SellingMaterialItem[];
  buyingMaterials: BuyingMaterialItem[];
};

type AuthState = {
  token: string | null;
  companyId: string | null;
  company: CompanyProfile | null;
  isLoadingProfile: boolean;
  profileError: string;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setToken: (token: string, companyId: string) => void;
  fetchProfile: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      companyId: null,
      company: null,
      isLoadingProfile: false,
      profileError: "",
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setToken: (token, companyId) => set({ token, companyId }),
      fetchProfile: async () => {
        if (!get().token) return;
        set({ isLoadingProfile: true, profileError: "" });
        try {
          const response = await apiClient.get("/api/manufacturing-companies/me");
          set({ company: response.data, isLoadingProfile: false });
        } catch (err) {
          if (axios.isAxiosError(err) && err.response?.data?.message) {
            set({ profileError: err.response.data.message, isLoadingProfile: false });
          } else {
            set({
              profileError: "Something went wrong. Please try again.",
              isLoadingProfile: false,
            });
          }
        }
      },
      logout: () => set({ token: null, companyId: null, company: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ token: state.token, companyId: state.companyId }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
