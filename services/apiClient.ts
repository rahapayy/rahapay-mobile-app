import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getItem, removeItem, setItem } from "@/utils/storage";
import { AuthServices } from "./modules";
import UserServices from "./modules/user";
import DeviceToken from "./modules/notificaiton";
import AirtimeService from "./modules/airtime";
import DataService from "./modules/data";
import BeneficiaryService from "./modules/beneficiary";
import CableService from "./modules/cable";
import ElectricityService from "./modules/electricity";

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

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    console.log("Response Interceptor - Success:", {
      status: res.status,
      data: res.data,
      url: res.config.url,
    });
    return res;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest: AxiosRequestConfig = error.config;

    console.log("Response Interceptor - Error:", {
      status,
      message: error.message,
      responseData: error.response?.data,
      url: originalRequest.url,
      method: originalRequest.method,
    });

    if (status === 401) {
      console.log("401 Detected - Handling unauthorized request");
      const errorMessage = error.response?.data?.message?.toLowerCase() || "";

      // Check if the 401 is due to an invalid PIN
      if (errorMessage.includes("pin")) {
        console.log("Invalid PIN detected - Rejecting error immediately");
        return Promise.reject(error); // Skip token refresh and propagate error
      }

      if (!isRefreshing) {
        isRefreshing = true;
        console.log("Starting token refresh process");
        try {
          const refreshTokenFromStorage =
            (await getItem("REFRESH_TOKEN", true)) ?? "";
          const accessTokenFromStorage =
            (await getItem("ACCESS_TOKEN", true)) ?? "";
          console.log("Tokens from storage:", {
            accessToken: accessTokenFromStorage,
            refreshToken: refreshTokenFromStorage,
          });

          const { accessToken, refreshToken } =
            await services.authService.refreshToken({
              refreshToken: refreshTokenFromStorage,
            });
          console.log("New tokens received:", { accessToken, refreshToken });

          setItem("ACCESS_TOKEN", accessToken, true);
          setItem("REFRESH_TOKEN", refreshToken, true);
          console.log("Tokens saved to storage");

          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
          console.log("Updated Authorization header with new token");

          console.log("Retrying queued requests:", refreshAndRetryQueue.length);
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            console.log("Retrying request:", config.url);
            axiosInstance
              .request(config)
              .then((response) => {
                console.log("Retry success:", config.url);
                resolve(response);
              })
              .catch((err) => {
                console.log("Retry failed:", config.url, err.message);
                reject(err);
              });
          });

          refreshAndRetryQueue.length = 0;
          console.log("Retry queue cleared");

          console.log("Retrying original request:", originalRequest.url);
          return await axiosInstance(originalRequest);
        } catch (refreshError: any) {
          console.error("Token refresh failed:", {
            message: refreshError.message,
            response: refreshError.response?.data,
            status: refreshError.response?.status,
          });
          removeItem("ACCESS_TOKEN", true);
          removeItem("REFRESH_TOKEN", true);
          console.log("Tokens removed from storage due to refresh failure");

          return Promise.reject(new Error(refreshError) as AxiosError);
        } finally {
          isRefreshing = false;
          console.log("Refresh process completed, isRefreshing set to false");
        }
      }

      console.log("Adding request to retry queue:", originalRequest.url);
      return new Promise<void>((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
        console.log("Current queue length:", refreshAndRetryQueue.length);
      });
    }

    if (status === 403 && error.response.data) {
      console.log(
        "403 Forbidden - Rejecting with response data:",
        error.response.data
      );
      return Promise.reject(new Error(error.response.data));
    }

    console.log("Rejecting error to caller:", error.message);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  async (config) => {
    const getToken = async () => {
      const token = await getItem("ACCESS_TOKEN", true);
      return token;
    };

    const token = await getToken();
    console.log("Request Interceptor - Adding token:", {
      url: config.url,
      method: config.method,
      token: token ? "Present" : "Not present",
    });

    if (token && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Interceptor - Error:", error.message);
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
