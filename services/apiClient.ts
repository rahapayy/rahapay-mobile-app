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

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

const refreshAndRetryQueue: RetryQueueItem[] = [];
let isRefreshing = false;

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => {
    // console.log("Response Interceptor - Success:", {
    //   status: res.status,
    //   data: res.data,
    //   url: res.config.url,
    // });
    return res;
  },
  async (error) => {
    const status = error.response ? error.response.status : null;
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Don't retry if the request has already been retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Handle 401 errors without automatically logging out
    if (status === 401) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshTokenFromStorage =
            (await getItem("REFRESH_TOKEN", true)) ?? "";
          const accessTokenFromStorage =
            (await getItem("ACCESS_TOKEN", true)) ?? "";

          const { accessToken, refreshToken } =
            await services.authService.refreshToken({
              refreshToken: refreshTokenFromStorage,
            });
            

          setItem("ACCESS_TOKEN", accessToken, true);
          setItem("REFRESH_TOKEN", refreshToken, true);

          axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            axiosInstance.request(config).then(resolve).catch(reject);
          });

          refreshAndRetryQueue.length = 0;
          return await axiosInstance(originalRequest);
        } catch (refreshError) {
          // Don't automatically log out, just reject the request
          return Promise.reject(refreshError);
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

    if (status === 403 && error.response.data) {
      // console.log(
      //   "403 Forbidden - Rejecting with response data:",
      //   error.response.data
      // );
      return Promise.reject(new Error(error.response.data));
    }

    // console.log("Rejecting error to caller:", error.message);
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
