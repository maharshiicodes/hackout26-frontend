import { create } from "zustand";
import axios from "axios";
import { logisticsApiClient } from "@/app/lib/logisticsApiClient";

// Holds the logistics profile page's data (company details + serviceable
// pincodes) outside of React state, mirroring authStore.ts's fetchProfile
// pattern. Kept separate from logisticsAuthStore (which only ever persists
// the token/id) since this data is unpersisted and page-specific.

export type LogisticsCompanyProfile = {
  _id: string;
  name: string;
  location: string;
  address: string;
  contactNum: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PincodeEntry = {
  pincode: string;
  addedAt: string;
};

function toErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err) && err.response?.data?.message) {
    return err.response.data.message;
  }
  return "Something went wrong. Please try again.";
}

type LogisticsProfileState = {
  company: LogisticsCompanyProfile | null;
  isLoadingProfile: boolean;
  profileError: string;
  fetchProfile: () => Promise<void>;

  pincodes: PincodeEntry[];
  pincodesTotal: number;
  pincodesPage: number;
  hasMorePincodes: boolean;
  isLoadingPincodes: boolean;
  isLoadingMorePincodes: boolean;
  pincodesError: string;
  fetchPincodes: (page: number) => Promise<void>;
  removePincode: (pincode: string) => void;

  reset: () => void;
};

export const useLogisticsProfileStore = create<LogisticsProfileState>()((set, get) => ({
  company: null,
  isLoadingProfile: false,
  profileError: "",
  fetchProfile: async () => {
    set({ isLoadingProfile: true, profileError: "" });
    try {
      const response = await logisticsApiClient.get<LogisticsCompanyProfile>(
        "/api/logistics-companies/me",
      );
      set({ company: response.data, isLoadingProfile: false });
    } catch (err) {
      set({ profileError: toErrorMessage(err), isLoadingProfile: false });
    }
  },

  pincodes: [],
  pincodesTotal: 0,
  pincodesPage: 1,
  hasMorePincodes: false,
  isLoadingPincodes: false,
  isLoadingMorePincodes: false,
  pincodesError: "",
  fetchPincodes: async (page) => {
    if (page === 1) set({ isLoadingPincodes: true, pincodesError: "" });
    else set({ isLoadingMorePincodes: true, pincodesError: "" });
    try {
      const response = await logisticsApiClient.get<{
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
        pincodes: PincodeEntry[];
      }>("/api/logistics/serviceability/pincodes", { params: { page, limit: 100 } });
      set({
        pincodes: page === 1 ? response.data.pincodes : [...get().pincodes, ...response.data.pincodes],
        pincodesTotal: response.data.total,
        pincodesPage: response.data.page,
        hasMorePincodes: response.data.hasMore,
        isLoadingPincodes: false,
        isLoadingMorePincodes: false,
      });
    } catch (err) {
      set({
        pincodesError: toErrorMessage(err),
        isLoadingPincodes: false,
        isLoadingMorePincodes: false,
      });
    }
  },
  removePincode: (pincode) =>
    set((state) => ({
      pincodes: state.pincodes.filter((entry) => entry.pincode !== pincode),
      pincodesTotal: state.pincodesTotal - 1,
    })),

  reset: () =>
    set({
      company: null,
      isLoadingProfile: false,
      profileError: "",
      pincodes: [],
      pincodesTotal: 0,
      pincodesPage: 1,
      hasMorePincodes: false,
      isLoadingPincodes: false,
      isLoadingMorePincodes: false,
      pincodesError: "",
    }),
}));
