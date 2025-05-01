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

console.log("Base URL:", axiosInstance.defaults.baseURL);

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
    // console.log("Response Interceptor - Success:", {
    //   status: res.status,
    //   data: res.data,
    //   url: res.config.url,
    // });
    return res;
  },
  async (error: AxiosError) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Don't retry if the request has already been retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Handle 401 errors
    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshTokenFromStorage =
            (await getItem("REFRESH_TOKEN", true)) ?? "";
          const accessTokenFromStorage =
            (await getItem("ACCESS_TOKEN", true)) ?? "";

          if (!refreshTokenFromStorage) {
            throw new Error("No refresh token available");
          }

          console.log("Attempting to refresh tokens:", {
            accessToken: accessTokenFromStorage ? "Present" : "Not present",
            refreshToken: refreshTokenFromStorage ? "Present" : "Not present",
          });

          const response = await services.authService.refreshToken({
            refreshToken: refreshTokenFromStorage,
          });

          const newAccessToken = response.accessToken;
          // Use new refreshToken if provided, otherwise reuse existing
          const newRefreshToken =
            response.refreshToken || refreshTokenFromStorage;

          if (!newAccessToken) {
            throw new Error("No access token returned from refresh endpoint");
          }

          if (!response.refreshToken) {
            console.warn(
              "Refresh token endpoint did not return a new refresh token. Reusing existing refresh token."
            );
            Sentry.captureMessage(
              "Refresh token endpoint did not return a new refresh token",
              "warning"
            );
          }

          console.log("New tokens received:", {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });

          await Promise.all([
            setItem("ACCESS_TOKEN", newAccessToken, true),
            setItem("REFRESH_TOKEN", newRefreshToken, true),
          ]);

          axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            axiosInstance.request(config).then(resolve).catch(reject);
          });

          refreshAndRetryQueue.length = 0;

          // Retry the original request
          originalRequest._retry = true;
          return await axiosInstance(originalRequest);
        } catch (refreshError: any) {
          console.error("Token refresh failed:", refreshError);
          Sentry.captureException(refreshError);

          // Trigger logout if refresh fails
          if (logoutCallback) {
            await logoutCallback();
          } else {
            // Fallback: Clear tokens manually
            await Promise.all([
              removeItem("ACCESS_TOKEN", true),
              removeItem("REFRESH_TOKEN", true),
            ]);
          }

          return Promise.reject(
            new Error("Session expired. Please log in again.")
          );
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    // console.log("Response Interceptor - Error:", {
    //   status,
    //   message: error.message,
    //   responseData: error.response?.data,
    //   url: originalRequest.url,
    //   method: originalRequest.method,
    // });

    if (status === 403 && error.response?.data) {
      // console.log(
      //   "403 Forbidden - Rejecting with response data:",
      //   error.response.data
      // );
      return Promise.reject(new Error(JSON.stringify(error.response.data)));
    }

    // console.log("Rejecting error to caller:", error.message);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getItem("ACCESS_TOKEN", true);
    // console.log("Request Interceptor - Adding token:", {
    //   url: config.url,
    //   method: config.method,
    //   token: token ? "Present" : "Not present",
    // });

    if (token && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // console.error("Request Interceptor - Error:", error.message);
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
