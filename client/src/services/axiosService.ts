import axios, { AxiosError } from "axios";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from "axios";

interface AxiosInstanceConfig {
  baseURL: string;
  timeout?: number;
  withAuth?: boolean;
  onUnauthorized?: () => void;
  headers?: Record<string, string>;
}

const setupInterceptors = (
  instance: AxiosInstance,
  config: AxiosInstanceConfig
): AxiosInstance => {
  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      if (config.withAuth !== false) {
        const token = localStorage.getItem("authToken");

        if (token && requestConfig.headers) {
          requestConfig.headers.Authorization = `Bearer ${token}`;
        }
      }

      return requestConfig;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            if (config.onUnauthorized) {
              config.onUnauthorized();
            } else {
              localStorage.removeItem("authToken");
              window.location.href = "/login";
            }
            break;
          case 403:
            console.error("Access forbidden:", error.response.data);
            break;
          case 404:
            console.error("Resource not found:", error.response.data);
            break;
          case 500:
            console.error("Server error:", error.response.data);
            break;
          default:
            console.error("API Error:", error.response.data);
        }
      } else if (error.request) {
        console.error("Network error: No response received", error.request);
      } else {
        console.error("Request setup error:", error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const createAxiosInstance = (
  config: AxiosInstanceConfig
): AxiosInstance => {
  const axiosConfig: CreateAxiosDefaults = {
    baseURL: config.baseURL,
    timeout: config.timeout || 10000,
    headers: {
      "Content-Type": "application/json",
      ...config.headers,
    },
  };

  const instance = axios.create(axiosConfig);
  return setupInterceptors(instance, config);
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const PEXELS_BASE_URL = "https://api.pexels.com/v1";
const WEATHER_BASE_URL = "";

export const apiClient = createAxiosInstance({
  baseURL: API_BASE_URL,
  withAuth: true,
});

export const pexelsClient = createAxiosInstance({
  baseURL: PEXELS_BASE_URL,
  withAuth: false,
  headers: {
    Authorization: import.meta.env.VITE_PEXELS_API_KEY || "",
  },
});

export default apiClient;
