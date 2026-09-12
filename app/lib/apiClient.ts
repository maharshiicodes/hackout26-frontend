import axios from "axios";
import { getStoredToken } from "@/app/lib/authStorage";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach the token saved at login (if any) to every request. Endpoints that
// don't require auth simply ignore the header; endpoints that do (e.g.
// POST /api/selling-materials, GET /api/manufacturing-companies/me) need it.
apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
