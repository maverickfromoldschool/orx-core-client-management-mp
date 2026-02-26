/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-use-before-define */
import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

import type {ApiError, ApiClientConfig} from './axios.types';

/**
 * Default timeout for API requests (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Creates a configured axios instance with interceptors
 */
export const createApiClient = (config: ApiClientConfig = {}): AxiosInstance => {
  const {
    baseURL = 'http://localhost:3000',
    timeout = DEFAULT_TIMEOUT,
    headers = {},
    withCredentials = true,
    onUnauthorized,
    onForbidden,
    onServerError
  } = config;

  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    withCredentials
  });

  // Request interceptor
  instance.interceptors.request.use(
    (requestConfig: InternalAxiosRequestConfig) => {
      // Add authorization token if available
      const token = getAuthToken();
      if (token && requestConfig.headers) {
        requestConfig.headers.set('Authorization', `Bearer ${token}`);
      }

      // Add correlation ID for request tracking
      if (requestConfig.headers) {
        requestConfig.headers.set('X-Correlation-ID', generateCorrelationId());
      }
      console.log({requestConfig});
      return requestConfig;
    },
    async (error: AxiosError) => {
      return Promise.reject(normalizeError(error));
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const normalizedError = normalizeError(error);

      // Handle specific HTTP status codes
      if (error.response) {
        const {status} = error.response;

        switch (status) {
          case 401:
            // Unauthorized - clear auth and redirect to login
            clearAuthToken();
            onUnauthorized?.();
            break;

          case 403:
            // Forbidden - user doesn't have permission
            onForbidden?.();
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            // Server errors
            onServerError?.(normalizedError);
            break;

          default:
            break;
        }
      }

      return Promise.reject(normalizedError);
    }
  );

  return instance;
};

const getBaseurl = () => {
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.href;
    if (currentUrl.startsWith('https://coreweb-test-ui.optum.com')) {
      return 'https://coreweb-test-api.optum.com';
    }
  }
  return 'https://coreweb-dev-api.optum.com';
};

/**
 * Default axios instance for general use
 */
export const apiClient = createApiClient({
  baseURL: getBaseurl(),
  withCredentials: false
});

/**
 * Normalizes axios errors into a consistent ApiError structure
 */
const normalizeError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with error status
    const {status, data} = error.response;
    return {
      message: (data as any)?.message || error.message || 'An error occurred',
      status,
      code: (data as any)?.code || `HTTP_${status}`,
      details: data
    };
  }

  if (error.request) {
    // Request made but no response received
    return {
      message: 'No response from server',
      code: 'NETWORK_ERROR',
      details: error.request
    };
  }

  // Error in request configuration
  return {
    message: error.message || 'Request configuration error',
    code: 'REQUEST_ERROR'
  };
};

/**
 * Retrieves authentication token from storage
 * Override this function based on your auth implementation
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    // Try sessionStorage first, then localStorage
    return sessionStorage.getItem('authToken') || localStorage.getItem('authToken') || null;
  } catch {
    return null;
  }
};

/**
 * Clears authentication token from storage
 */
const clearAuthToken = (): void => {
  if (typeof window === 'undefined') return;

  try {
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('authToken');
  } catch {
    // Ignore storage errors
  }
};

/**
 * Generates a unique correlation ID for request tracking
 */
const generateCorrelationId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Type-safe wrapper for GET requests
 */
export const get = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.get<T>(url, config).then((response) => response.data);
};

/**
 * Type-safe wrapper for POST requests
 */
export const post = async <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.post<T>(url, data, config).then((response) => response.data);
};

/**
 * Type-safe wrapper for PUT requests
 */
export const put = async <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.put<T>(url, data, config).then((response) => response.data);
};

/**
 * Type-safe wrapper for PATCH requests
 */
export const patch = async <T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.patch<T>(url, data, config).then((response) => response.data);
};

/**
 * Type-safe wrapper for DELETE requests
 */
export const del = async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  return apiClient.delete<T>(url, config).then((response) => response.data);
};

/**
 * Checks if an error is an ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' && error !== null && 'message' in error && typeof (error as ApiError).message === 'string'
  );
};

/**
 * Export axios types for convenience
 */
export type {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig};
