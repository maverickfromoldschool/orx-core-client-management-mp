/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {ErrorType} from '../components/error-toast';

/**
 * Error response structure from API
 */
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  details?: string[];
}

/**
 * Categorized error information
 */
export interface CategorizedError {
  type: ErrorType;
  message: string;
  canRetry: boolean;
}

/**
 * Categorize error based on error object
 *
 * Requirements:
 * - 11.1: API error message display
 * - 11.2: Network error specific messaging
 *
 * @param error - Error object from API or network request
 * @returns Categorized error with type, message, and retry capability
 */
export const categorizeError = (error: any): CategorizedError => {
  // Network errors (timeout, connection refused, DNS failure)
  if (
    error.code === 'ECONNABORTED' ||
    error.code === 'ECONNREFUSED' ||
    error.code === 'ETIMEDOUT' ||
    error.message?.includes('Network Error') ||
    error.message?.includes('timeout') ||
    error.message?.includes('network')
  ) {
    return {
      type: 'network',
      message: 'Unable to connect to the server',
      canRetry: true
    };
  }

  // API errors with response
  if (error.response) {
    const {status} = error.response;
    const data: ApiErrorResponse = error.response.data || {};

    // 401 Unauthorized - Session expired
    if (status === 401) {
      return {
        type: 'api',
        message: 'Your session has expired. Please log in again.',
        canRetry: false
      };
    }

    // 403 Forbidden - Insufficient permissions
    if (status === 403) {
      return {
        type: 'api',
        message: 'You do not have permission to perform this action.',
        canRetry: false
      };
    }

    // 404 Not Found
    if (status === 404) {
      return {
        type: 'api',
        message: data.message || 'The requested resource was not found.',
        canRetry: false
      };
    }

    // 409 Conflict - Duplicate or constraint violation
    if (status === 409) {
      return {
        type: 'api',
        message: data.message || 'A conflict occurred. The resource may already exist.',
        canRetry: false
      };
    }

    // 400 Bad Request - Validation error
    if (status === 400) {
      return {
        type: 'validation',
        message: data.message || 'Invalid data provided. Please check your input.',
        canRetry: false
      };
    }

    // 500+ Server errors
    if (status >= 500) {
      return {
        type: 'api',
        message: 'A server error occurred. Please try again later.',
        canRetry: true
      };
    }

    // Other API errors
    return {
      type: 'api',
      message: data.message || data.error || 'An error occurred while processing your request.',
      canRetry: false
    };
  }

  // Generic errors
  return {
    type: 'general',
    message: error.message || 'An unexpected error occurred.',
    canRetry: false
  };
};

/**
 * Format bulk operation error message
 *
 * Requirements:
 * - 11.4: Bulk operation error details
 *
 * @param successCount - Number of successful operations
 * @param failedIds - Array of IDs that failed
 * @param totalCount - Total number of operations attempted
 * @returns Formatted error message
 */
export const formatBulkErrorMessage = (successCount: number, failedIds: string[], totalCount: number): string => {
  const failedCount = failedIds.length;

  if (failedCount === totalCount) {
    return `Failed to delete all ${totalCount} variant assignments.`;
  }

  if (failedCount === 1) {
    return `Successfully deleted ${successCount} of ${totalCount} variant assignments. Failed to delete 1 assignment (ID: ${failedIds[0]}).`;
  }

  return `Successfully deleted ${successCount} of ${totalCount} variant assignments. Failed to delete ${failedCount} assignments (IDs: ${failedIds.join(', ')}).`;
};

/**
 * Check if error is a network error
 *
 * @param error - Error object
 * @returns True if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  return categorizeError(error).type === 'network';
};

/**
 * Check if error is retryable
 *
 * @param error - Error object
 * @returns True if error can be retried
 */
export const isRetryableError = (error: any): boolean => {
  return categorizeError(error).canRetry;
};

/**
 * Get user-friendly error message
 *
 * @param error - Error object
 * @returns User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error: any): string => {
  return categorizeError(error).message;
};
