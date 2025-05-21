import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import { getItem, setItem, removeItem } from "@/utils/storage";
import { handleShowFlash } from "@/components/FlashMessageComponent";
import * as Sentry from "@sentry/react-native";
import { AuthServices, UserServices } from "./modules";
import DeviceToken from "./modules/notificaiton";
import AirtimeService from "./modules/airtime";
import DataService from "./modules/data";
import BeneficiaryService from "./modules/beneficiary";
import CableService from "./modules/cable";
import ElectricityService from "./modules/electricity";

// Types
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Axios Instances
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://api.yourapp.com";
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "App-Version": "1.0.1",
  },
});

export const axiosInstanceWithoutToken = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "App-Version": "1.0.1",
  },
});

// Token Refresh State
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Logout Callback
let logoutCallback: (() => Promise<void>) | null = null;
export const setLogoutCallback = (callback: () => Promise<void>) => {
  logoutCallback = callback;
};

// Token Refresh Logic
const authService = new AuthServices(axiosInstanceWithoutToken);

const refreshAccessToken = async () => {
  try {
    const refreshToken = await getItem("REFRESH_TOKEN", true);
    if (!refreshToken) throw new Error("No refresh token");

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshToken({ refreshToken });

    await Promise.all([
      setItem("ACCESS_TOKEN", accessToken, true),
      newRefreshToken && setItem("REFRESH_TOKEN", newRefreshToken, true),
    ]);

    return accessToken;
  } catch (error: any) {
    Sentry.captureException(error);
    if (
      error.response?.status === 401 &&
      ["Unauthorized", "Invalid Token", "Token expired"].includes(
        error.response?.data?.message
      )
    ) {
      await Promise.all([
        removeItem("ACCESS_TOKEN", true),
        removeItem("REFRESH_TOKEN", true),
      ]);
      if (logoutCallback) await logoutCallback();
      handleShowFlash({ message: "Session expired", type: "danger" });
    }
    throw error;
  }
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getItem("ACCESS_TOKEN", true);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token: string) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        refreshSubscribers.forEach((cb) => cb(newToken));
        refreshSubscribers = [];
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        refreshSubscribers.forEach((cb) => cb(""));
        refreshSubscribers = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// API Client Helper
export const apiClient = async <T>(
  path: string,
  method: "get" | "post" | "put" | "delete" | "patch" = "get",
  data?: any,
  headers: Record<string, string> = {}
): Promise<T> => {
  try {
    const response = await axiosInstance({ method, url: path, data, headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || "An error occurred";
      Sentry.captureException(error);

      switch (status) {
        case 400:
          if (message === "OTP not found") {
            handleShowFlash({ message: "OTP not found", type: "danger" });
          } else if (message.includes("Validation errors")) {
            const errors = error.response?.data?.data;
            const errorMessage = Array.isArray(errors)
              ? Object.values(errors[0]).join(", ")
              : message;
            handleShowFlash({
              message: errorMessage || "Invalid request",
              type: "danger",
            });
          } else {
            handleShowFlash({
              message: message || "Invalid request",
              type: "danger",
            });
          }
          break;
        case 401:
          if (message === "Invalid transaction PIN") {
            handleShowFlash({
              message: "Invalid transaction PIN",
              type: "danger",
            });
          } else if (
            ["Unauthorized", "Invalid Token", "Token expired"].includes(message)
          ) {
            if (logoutCallback) await logoutCallback();
            handleShowFlash({ message: "Session expired", type: "danger" });
          } else {
            handleShowFlash({
              message: message || "Authentication failed",
              type: "danger",
            });
          }
          break;
        case 403:
          handleShowFlash({
            message: message || "Access forbidden",
            type: "danger",
          });
          break;
        case 500:
          handleShowFlash({
            message: "Something went wrong. Please try again",
            type: "danger",
          });
          break;
        case 503:
          handleShowFlash({ message: "Service unavailable", type: "danger" });
          break;
        default:
          handleShowFlash({ message, type: "danger" });
      }
      throw new Error(message);
    }
    throw error;
  }
};

// Export Services
export const services = {
  authService,
  authServiceToken: new AuthServices(axiosInstance),
  userService: new UserServices(axiosInstance),
  notificationService: new DeviceToken(axiosInstance),
  airtimeService: new AirtimeService(axiosInstance),
  dataService: new DataService(axiosInstance),
  beneficiaryService: new BeneficiaryService(axiosInstance),
  cableService: new CableService(axiosInstance),
  electricityService: new ElectricityService(axiosInstance),
};
