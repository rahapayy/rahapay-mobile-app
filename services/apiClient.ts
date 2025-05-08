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

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 840000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const axiosInstanceWithoutToken = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// console.log("Base URL:", axiosInstance.defaults.baseURL);

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

// Function to trigger logout (set by AuthProvider)
let logoutCallback: (() => Promise<void>) | null = null;

export const setLogoutCallback = (callback: () => Promise<void>) => {
  logoutCallback = callback;
};

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    // console.log("[API] Request Success:", {
    //   url: res.config.url,
    //   method: res.config.method,
    //   status: res.status,
    // });
    return res;
  },
  async (error: AxiosError) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // console.log("[API] Request Error:", {
    //   url: originalRequest.url,
    //   method: originalRequest.method,
    //   status,
    //   isRetry: originalRequest._retry,
    //   error: error.message,
    // });

    // Don't retry if the request has already been retried
    if (originalRequest._retry) {
      // console.log("[API] Skipping retry - already attempted");
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (status === 401) {
      // console.log("[API] 401 detected, checking refresh status");
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshTokenFromStorage =
            (await getItem("REFRESH_TOKEN", true)) ?? "";
          const accessTokenFromStorage =
            (await getItem("ACCESS_TOKEN", true)) ?? "";

          // console.log("[API] Token refresh attempt:", {
          //   hasRefreshToken: !!refreshTokenFromStorage,
          //   hasAccessToken: !!accessTokenFromStorage,
          // });

          if (!refreshTokenFromStorage) {
            // console.log("[API] No refresh token available");
            throw new Error("No refresh token available");
          }

          const response = await services.authService.refreshToken({
            refreshToken: refreshTokenFromStorage,
          });

          // console.log("[API] Token refresh response:", {
          //   hasNewAccessToken: !!response.accessToken,
          //   hasNewRefreshToken: !!response.refreshToken,
          // });

          const newAccessToken = response.accessToken;
          const newRefreshToken =
            response.refreshToken || refreshTokenFromStorage;

          if (!newAccessToken) {
            // console.error("[API] No access token in refresh response");
            throw new Error("Failed to refresh access token");
          }

          await Promise.all([
            setItem("ACCESS_TOKEN", newAccessToken, true),
            setItem("REFRESH_TOKEN", newRefreshToken, true),
          ]);

          // console.log("[API] New tokens stored successfully");

          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          // Process queued requests
          // console.log(
          //   "[API] Processing queued requests:",
          //   refreshAndRetryQueue.length
          // );
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };
            axiosInstance.request(config).then(resolve).catch(reject);
          });

          refreshAndRetryQueue.length = 0;

          // Retry the original request
          originalRequest._retry = true;
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          };

          // console.log("[API] Retrying original request:", originalRequest.url);
          return await axiosInstance(originalRequest);
        } catch (refreshError: any) {
          // console.error("[API] Token refresh failed:", {
          //   error: refreshError,
          //   status: refreshError.response?.status,
          //   data: refreshError.response?.data,
          //   message: refreshError.message,
          // });
          Sentry.captureException(refreshError);

          // Only trigger logout if it's a genuine authentication error
          if (
            refreshError.response?.status === 401 ||
            refreshError.response?.status === 403
          ) {
            // console.log(
            //   "[API] Authentication error detected, triggering logout"
            // );
            if (logoutCallback) {
              await logoutCallback();
            } else {
              await Promise.all([
                removeItem("ACCESS_TOKEN", true),
                removeItem("REFRESH_TOKEN", true),
              ]);
            }
            return Promise.reject(
              new Error("Session expired. Please log in again.")
            );
          }

          // console.log(
          //   "[API] Non-auth error during refresh, not logging out:",
          //   refreshError.message
          // );
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        // console.log("[API] Adding request to refresh queue");
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    if (status === 403 && error.response?.data) {
      return Promise.reject(new Error(JSON.stringify(error.response.data)));
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getItem("ACCESS_TOKEN", true);
    if (token && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

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
