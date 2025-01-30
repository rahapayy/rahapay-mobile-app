import { getItem, removeItem, setItem } from "../utils/storage";
import { UseQueryOptions, useMutation, useQuery } from "react-query";
import Axios, { AxiosInstance, AxiosResponse } from "axios";
import { AuthServices } from "./modules";

// Supported HTTP methods
type MethodTypes = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// Create an Axios instance
const axiosInstance: AxiosInstance = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 840000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosInstanceWithoutToken = Axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Function to handle unauthorized responses (401)
let onUnauthorizedCallback = () => {};

// Set the callback for unauthorized handling
export const setOnUnauthorizedCallback = (cb: () => void) => {
  onUnauthorizedCallback = cb;
};

// Function to retrieve the access token
const getAccessToken = async (): Promise<string | null> => {
  return await getItem("access_token");
};

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle 401 responses and call the unauthorized callback
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await removeItem("access_token");
        onUnauthorizedCallback(); // Trigger unauthorized callback
      } catch (e) {
        console.error("Error removing token:", e);
      }
    }
    return Promise.reject(error);
  }
);

// Axios request function
const makeRequest = async (
  method: MethodTypes,
  url: string,
  data?: any
): Promise<AxiosResponse> => {
  const response = await axiosInstance({
    method,
    url,
    data,
  });
  return response;
};

// Export Axios instance for direct use
export const axios = axiosInstance;

// Wrapper functions for React Query with Axios
export default {
  get: (url: string, options?: UseQueryOptions) =>
    useQuery(
      url,
      () => makeRequest("GET", url),
      options as UseQueryOptions<AxiosResponse, unknown, AxiosResponse, string>
    ),

  post: (url: string) =>
    useMutation((data: any) => makeRequest("POST", url, data)),

  put: (url: string) =>
    useMutation((data: any) => makeRequest("PUT", url, data)),

  delete: (url: string) => useMutation(() => makeRequest("DELETE", url)),

  patch: <TData, TError>(url: string) =>
    useMutation((data: any) => makeRequest("PATCH", url, data)),
};
