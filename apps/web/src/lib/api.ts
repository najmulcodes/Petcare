import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : "/api/v1";

export const api = axios.create({ baseURL });

// The active access token is stored here by AuthContext when the session
// changes. This avoids calling supabase.auth.getSession() on every request.
let _accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  _accessToken = token;
}

api.interceptors.request.use((config) => {
  if (_accessToken) {
    config.headers.Authorization = `Bearer ${_accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — AuthContext listener will pick up the sign-out
      setAccessToken(null);
    }
    return Promise.reject(error);
  }
);
