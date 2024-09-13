import AsyncStorage from "@react-native-async-storage/async-storage";
import { UseQueryOptions, useMutation, useQuery } from "react-query";
import Axios, { AxiosInstance, AxiosResponse } from "axios";
import { getItem } from "./ayncStorage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;
type MethodTypes = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

const axiosInstance: AxiosInstance = Axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let onUnauthorizedCallback = () => {}; // Initial empty function

// Function to set the callback
export const setOnUnauthorizedCallback = (cb: () => void) => {
  onUnauthorizedCallback = cb;
};

// Response interceptor to handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        // await AsyncStorage.removeItem("access_token");
        onUnauthorizedCallback(); // Call the onUnauthorized callback
      } catch (e) {
        console.error(e);
      }
    }
    return Promise.reject(error);
  }
);

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = await getItem("access_token");
  if (accessToken) {
    console.log({ accessToken });
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor to handle 401 responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      try {
        await AsyncStorage.removeItem("access_token");
      } catch (e) {
        console.error(e);
      }
    }
    return Promise.reject(error);
  }
);

export const axios = axiosInstance;

const makeRequest = async (method: MethodTypes, url: string, data?: any) => {
  const response = await axiosInstance({
    method,
    url: `${url}`,
    data,
  });

  return response;
};

export default {
  get: (url: string, options?: UseQueryOptions) =>
    useQuery(
      url,
      () => makeRequest("GET", url),
      options as Omit<AxiosResponse, any>
    ),
  post: (url: string) =>
    useMutation((data: any) => makeRequest("POST", url, data)),
  put: (url: string) =>
    useMutation((data: any) => makeRequest("PUT", url, data)),
  delete: (url: string) => useMutation(() => makeRequest("DELETE", url)),
  patch: <TData, TError>(path: string) => {
    return useMutation<any, any, any>((data) =>
      makeRequest("PATCH", path, data)
    );
  },
};
