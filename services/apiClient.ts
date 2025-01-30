import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { AuthServices } from "./modules";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 840000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Custom-Keyword": "ProsplugMobileApp", // Custom keyword added
    "App-Version": "1.0.0", // Update this version as needed
  },
});

export const axiosInstanceWithoutToken = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Custom-Keyword": "ProsplugMobileApp", // Custom keyword added
    "App-Version": "1.0.0", // Update this version as needed
  },
});

// Define the structure of a retry queue item
interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

// Create a list to hold the request queue
const refreshAndRetryQueue: RetryQueueItem[] = [];

// Flag to prevent multiple token refresh requests
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    return res; // Simply return the response
  },
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest: AxiosRequestConfig = error.config;

    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Fetch saved access & refresh token
          const refreshTokenFromStorage =
            (await getItem("REFRESH_TOKEN", true)) ?? "";
          const accessTokenFromStorage =
            (await getItem("ACCESS_TOKEN", true)) ?? "";
          // Get new tokens
          const { accessToken, refreshToken } =
            await services.authService.refreshToken({
              accessToken: accessTokenFromStorage,
              refreshToken: refreshTokenFromStorage,
            });

          setItem("ACCESS_TOKEN", accessToken, true);
          setItem("REFRESH_TOKEN", refreshToken, true);

          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          // Retry all requests in the queue with the new token
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            axiosInstance
              .request(config)
              .then((response) => resolve(response))
              .catch((err) => reject(err));
          });

          // Clear the queue
          refreshAndRetryQueue.length = 0;

          return await axiosInstance(originalRequest);
        } catch (refreshError: any) {
          console.error("Token refresh failed:", refreshError);
          removeItem("ACCESS_TOKEN", true);
          removeItem("REFRESH_TOKEN", true);

          // Redirect to login
          return Promise.reject(new Error(refreshError) as AxiosError);
        } finally {
          isRefreshing = false;
        }
      }

      // Add the original request to the queue
      return new Promise<void>((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    if (status === 403 && error.response.data) {
      return Promise.reject(new Error(error.response.data));
    }

    return Promise.reject(new Error(error));
  }
);

axiosInstance.interceptors.request.use(
  async (config) => {
    const getToken = async () => {
      const token = await getItem("ACCESS_TOKEN", true);
      if (token) {
        return token;
      } else {
        return "";
      }
    };

    const token = await getToken();
    if (token != "" || token != null) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(new Error(error))
);

export const services = {
  authService: new AuthServices(axiosInstanceWithoutToken),
  authServiceToken: new AuthServices(axiosInstance),
};
