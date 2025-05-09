import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getItem, setItem, removeItem } from "@/utils/storage";
import { AuthServices } from "./modules";
import UserServices from "./modules/user";
import DeviceToken from "./modules/notificaiton";
import AirtimeService from "./modules/airtime";
import DataService from "./modules/data";
import BeneficiaryService from "./modules/beneficiary";
import CableService from "./modules/cable";
import ElectricityService from "./modules/electricity";
import * as Sentry from "@sentry/react-native";

// Types
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

// Constants
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const TOKEN_REFRESH_ENDPOINT = "/auth/refresh-token";

// Create axios instances
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 840000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const axiosInstanceWithoutToken = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

console.log("Base URL:", axiosInstance.defaults.baseURL);

// Token refresh state
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Logout callback
let logoutCallback: (() => Promise<void>) | null = null;

export const setLogoutCallback = (callback: () => Promise<void>) => {
  logoutCallback = callback;
};

// Token refresh function
const refreshAccessToken = async (): Promise<string> => {
  try {
    const refreshToken = await getItem("REFRESH_TOKEN", true);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axiosInstanceWithoutToken.post<RefreshTokenResponse>(
      TOKEN_REFRESH_ENDPOINT,
      { refreshToken }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    if (!accessToken) {
      throw new Error("Failed to refresh access token");
    }

    await Promise.all([
      setItem("ACCESS_TOKEN", accessToken, true),
      setItem("REFRESH_TOKEN", newRefreshToken || refreshToken, true),
    ]);

    return accessToken;
  } catch (error: any) {
    console.error("[API] Token refresh failed:", error);
    Sentry.captureException(error);

    // Only logout for specific authentication errors
    if (
      error.response?.status === 401 &&
      (error.response?.data?.message === "Unauthorized" ||
        error.response?.data?.message === "Invalid Token" ||
        error.response?.data?.message === "Token expired")
    ) {
      // Clear tokens and trigger logout
      await Promise.all([
        removeItem("ACCESS_TOKEN", true),
        removeItem("REFRESH_TOKEN", true),
      ]);

      if (logoutCallback) {
        await logoutCallback();
      }
    }

    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getItem("ACCESS_TOKEN", true);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log("[API] Request Success:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Log error
    console.log("[API] Request Error:", {
      url: originalRequest.url,
      method: originalRequest.method,
      status: error.response?.status,
      isRetry: originalRequest._retry,
      error: error.message,
    });

    // Handle 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Use existing refresh promise if one is in progress
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAccessToken();
        }

        const newToken = await refreshPromise;

        // Update the failed request's headers
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    // Handle 403 errors
    if (error.response?.status === 403 && error.response?.data) {
      return Promise.reject(new Error(JSON.stringify(error.response.data)));
    }

    return Promise.reject(error);
  }
);

// API Client helper function
export const apiClient = async <T>(
  path: string,
  method: "get" | "post" | "put" | "delete" | "patch" = "get",
  data?: any,
  extraHeaders = {}
): Promise<T> => {
  try {
    const response = await axiosInstance({
      method,
      url: path,
      data,
      headers: {
        ...extraHeaders,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      // Handle specific error cases
      switch (status) {
        case 400:
          throw new Error(message || "Bad request");
        case 401:
          // Only logout for specific authentication errors
          if (
            message === "Unauthorized" ||
            message === "Invalid Token" ||
            message === "Token expired"
          ) {
            if (logoutCallback) {
              await logoutCallback();
            }
            throw new Error("Session expired");
          }
          // For other 401 errors (like invalid PIN), just throw the error
          throw new Error(message || "Authentication failed");
        case 403:
          throw new Error(message || "Access forbidden");
        case 500:
          throw new Error("Internal server error");
        case 503:
          throw new Error("Service unavailable");
        default:
          throw new Error(message || "An error occurred");
      }
    }
    throw error;
  }
};

// Export services
export const services = {
  authService: new AuthServices(axiosInstanceWithoutToken),
  authServiceToken: new AuthServices(axiosInstance),
  userService: new UserServices(axiosInstance),
  notificationService: new DeviceToken(axiosInstance),
  airtimeService: new AirtimeService(axiosInstance),
  dataService: new DataService(axiosInstance),
  beneficiaryService: new BeneficiaryService(axiosInstance),
  cableService: new CableService(axiosInstance),
  electricityService: new ElectricityService(axiosInstance),
};
