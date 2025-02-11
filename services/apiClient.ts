import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import { useMutation, useQuery, UseQueryOptions } from "react-query";
import { getItem, removeItem } from "@/utils/storage";
import { AuthServices } from "./modules";

// Supported HTTP methods
type MethodTypes = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Base API URL
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Create Axios instances
const createAxiosInstance = (withAuth: boolean): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 840000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (withAuth) {
    instance.interceptors.request.use(async (config) => {
      const accessToken = await getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await removeItem("accessToken");
          onUnauthorizedCallback();
        }
        return Promise.reject(error);
      }
    );
  }

  return instance;
};

export const axiosInstance = createAxiosInstance(true);
export const axiosInstanceWithoutToken = createAxiosInstance(false);

// Unauthorized callback handler
let onUnauthorizedCallback = () => {};
export const setOnUnauthorizedCallback = (cb: () => void) => {
  onUnauthorizedCallback = cb;
};

// Axios request function
const makeRequest = async (
  method: MethodTypes,
  url: string,
  data?: any
): Promise<AxiosResponse> => {
  return axiosInstance({ method, url, data });
};

// React Query wrappers
const apiClient = {
  get: (url: string, options?: UseQueryOptions<AxiosResponse>) =>
    useQuery<AxiosResponse>(url, () => makeRequest("GET", url), options),

  post: (url: string) =>
    useMutation<AxiosResponse>((data: any) => makeRequest("POST", url, data)),
  put: (url: string) =>
    useMutation<AxiosResponse>((data: any) => makeRequest("PUT", url, data)),
  delete: (url: string) =>
    useMutation<AxiosResponse>(() => makeRequest("DELETE", url)),
  patch: (url: string) =>
    useMutation((data: any) => makeRequest("PATCH", url, data)),
};

export default apiClient;

export const services = {
  authService: new AuthServices(axiosInstanceWithoutToken),
  authServiceToken: new AuthServices(axiosInstance),
};
