/**
 * API Error structure for consistent error handling across the application
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Configuration options for creating an axios instance
 */
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  onUnauthorized?: () => void;
  onForbidden?: () => void;
  onServerError?: (error: ApiError) => void;
}

/**
 * Pagination parameters for list endpoints
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

/**
 * Standard paginated response structure
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  timestamp?: string;
}
