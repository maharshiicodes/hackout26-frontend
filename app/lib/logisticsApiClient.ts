import axios from "axios";
import { getStoredLogisticsToken } from "@/app/lib/logisticsAuthStorage";

// Mirrors apiClient.ts but attaches the logistics company's token instead of
// the manufacturing company's. Kept separate because the two account types
// carry distinct tokens (see logisticsAuthStorage.ts) - the shared apiClient
// only ever attaches the manufacturing token, so logistics-only endpoints
// (e.g. GET /api/logistics-companies/me) need this instance instead.
export const logisticsApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

logisticsApiClient.interceptors.request.use((config) => {
  const token = getStoredLogisticsToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
