import { stateManagement } from "@/store";
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

// SET AXIOS DOMAIN
const axiosIns = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
});

// SET REQUEST HEADER
axiosIns.interceptors.request.use((config: AxiosRequestConfig) => {
  const store = stateManagement();
  const token = store.getAccessToken;
  if (config.headers) {
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// CHECK SERVER RESPONSE
axiosIns.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const store = stateManagement();
    const original_request = error.config as AxiosRequestConfig;
    // CHECK IF UNAUTHORIZED
    if (error.response?.status === 401) {
      const refresh_token = store.getRefreshToken || "";
      const user_id = store.getUser.id || "";
      if (refresh_token) {
        try {
          // REQUEST REFRESH TOKEN
          const res = await axiosIns.post("auth/refresh-token", {
            data: {
              refresh_token,
              user_id,
            },
          });
          // SAVE TOKEN ON STATE MANAGEMENT
          store.tokenHandler(res.data.access_token, res.data.refresh_token);
          // REQUEST WITH NEW TOKEN
          const updated_request: AxiosRequestConfig = {
            ...original_request,
            headers: {
              Authorization: `Bearer ${res.data.access_token}`,
            },
          };
          return axiosIns(updated_request);
        } catch (err) {
          store.logoutHandler();
        }
      } else {
        store.logoutHandler();
      }
    }
    return Promise.reject(error);
  }
);

export default axiosIns;
