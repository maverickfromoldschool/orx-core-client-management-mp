/* eslint-disable import/no-extraneous-dependencies */
import axios, {AxiosInstance} from 'axios';
import {z} from 'zod';
import {apiClient} from '@optum-rx-core/orx-core-axios';

import {ApiConfig, GetAccountingCodesParams} from '../types/api-accounting-code-config.types';
import {AccountingCodeRow} from '../components/accounting-codes/AccountingCodeList/AccountingCodeList.types';
import {AddAccountingCodeFormData} from '../components/accounting-codes/AddAccountingCodeDialog/AddAccountingCodeDialog.types';
import {EditAccountingCodeFormData} from '../components/accounting-codes/EditAccountingCodeDialog/EditAccountingCodeDialog.types';
import {
  CreateAccountingCodeRequest,
  CreatedAccountingCode,
  CreateAccountingCodeResponse,
  GetAccountingCodeResponse,
  UpdateAccountingCodeRequest,
  UpdatedAccountingCode,
  UpdateAccountingCodeResponse,
  GetAccountingCodesListParams,
  GetAccountingCodesListResponse,
  ApiErrorResponse
} from '../types/accounting-code-api.types';
import {
  createAccountingCodeRequestSchema,
  createAccountingCodeResponseSchema,
  getAccountingCodeResponseSchema,
  updateAccountingCodeRequestSchema,
  updateAccountingCodeResponseSchema,
  getAccountingCodesListResponseSchema
} from '../schemas/accounting-code-api.schemas';

/**
 * API Service for Accounting Code operations
 */
export class AccountingCodeApiService {
  private axiosInstance: AxiosInstance;

  private endpoints: ApiConfig['endpoints'];

  constructor(config: ApiConfig) {
    // Use apiClient instance from @optum-rx-core/orx-core-axios
    this.axiosInstance = apiClient;

    if (config.timeout) {
      this.axiosInstance.defaults.timeout = config.timeout;
    }
    if (config.headers) {
      this.axiosInstance.defaults.headers.common = {
        ...this.axiosInstance.defaults.headers.common,
        ...config.headers
      };
    }

    this.endpoints = config.endpoints;
  }

  /**
   * Update axios instance headers (useful for auth tokens)
   */
  updateHeaders(headers: Record<string, string>) {
    this.axiosInstance.defaults.headers.common = {
      ...this.axiosInstance.defaults.headers.common,
      ...headers
    };
  }

  /**
   * Fetch accounting codes list with pagination and search
   */
  async getAccountingCodes(params?: GetAccountingCodesParams) {
    const response = await this.axiosInstance.get<{
      data: AccountingCodeRow[];
      totalCount: number;
      page: number;
      pageSize: number;
    }>(this.endpoints.getAccountingCodes, {
      params
    });

    return response.data;
  }

  /**
   * Create a new accounting code
   */
  async createAccountingCode(data: AddAccountingCodeFormData) {
    const response = await this.axiosInstance.post<AccountingCodeRow>(this.endpoints.createAccountingCode, data);

    return response.data;
  }

  /**
   * Update an existing accounting code
   */
  async updateAccountingCode(id: string, data: EditAccountingCodeFormData) {
    const endpoint = this.endpoints.updateAccountingCode.replace(':id', id);
    const response = await this.axiosInstance.put<AccountingCodeRow>(endpoint, data);

    return response.data;
  }

  /**
   * Delete an accounting code
   */
  async deleteAccountingCode(id: string) {
    const endpoint = this.endpoints.deleteAccountingCode.replace(':id', id);
    await this.axiosInstance.delete(endpoint);
  }

  /**
   * Fetch GL account types
   */
  async getGlAccountTypes() {
    if (!this.endpoints.getGlAccountTypes) {
      throw new Error('GL Account Types endpoint not configured');
    }

    const response = await this.axiosInstance.get<{value: string; label: string}[]>(this.endpoints.getGlAccountTypes);

    return response.data;
  }

  /**
   * Fetch GL account groups
   */
  async getGlAccountGroups() {
    if (!this.endpoints.getGlAccountGroups) {
      throw new Error('GL Account Groups endpoint not configured');
    }

    const response = await this.axiosInstance.get<{value: string; label: string}[]>(this.endpoints.getGlAccountGroups);

    return response.data;
  }

  /**
   * Fetch GL accounting key plugins
   */
  async getGlAccountingKeyPlugins() {
    if (!this.endpoints.getGlAccountingKeyPlugins) {
      throw new Error('GL Accounting Key Plugins endpoint not configured');
    }

    const response = await this.axiosInstance.get<{value: string; label: string}[]>(
      this.endpoints.getGlAccountingKeyPlugins
    );

    return response.data;
  }

  /**
   * Create a new accounting code (v1 API)
   * @param data - Accounting code creation request payload
   * @returns Promise resolving to the created accounting code data
   * @throws {Error} When request payload validation fails
   * @throws {Error} When API returns an error response
   * @throws {Error} When network request fails
   */
  async createAccountingCodeV1(data: CreateAccountingCodeRequest): Promise<CreatedAccountingCode> {
    try {
      // Validate request payload
      const validatedData = createAccountingCodeRequestSchema.parse(data);

      // Make POST request
      const response = await this.axiosInstance.post<CreateAccountingCodeResponse>(
        this.endpoints.createAccountingCodeV1,
        validatedData
      );

      // Validate response structure
      const validatedResponse = createAccountingCodeResponseSchema.parse(response.data);

      // Check success flag
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.message || 'Failed to create accounting code');
      }

      return validatedResponse.data;
    } catch (error) {
      // Handle and normalize errors
      throw AccountingCodeApiService.normalizeError(error);
    }
  }

  /**
   * Get a single accounting code (v1 API)
   * @param accountingCode - The accounting code identifier to retrieve
   * @returns Promise resolving to the accounting code data
   * @throws {Error} When API returns an error response
   * @throws {Error} When network request fails
   */
  async getAccountingCodeV1(accountingCode: string): Promise<CreatedAccountingCode> {
    try {
      const endpoint = this.endpoints.getAccountingCodeV1.replace(':accountingCode', accountingCode);
      const response = await this.axiosInstance.get<GetAccountingCodeResponse>(endpoint);

      const validatedResponse = getAccountingCodeResponseSchema.parse(response.data);

      if (!validatedResponse.success) {
        throw new Error(validatedResponse.message || 'Failed to retrieve accounting code');
      }

      return validatedResponse.data;
    } catch (error) {
      throw AccountingCodeApiService.normalizeError(error);
    }
  }

  /**
   * Update an existing accounting code (v1 API)
   * @param accountingCode - The accounting code identifier to update
   * @param data - Accounting code update request payload
   * @returns Promise resolving to the updated accounting code data
   * @throws {Error} When request payload validation fails
   * @throws {Error} When API returns an error response
   * @throws {Error} When network request fails
   */
  async updateAccountingCodeV1(
    accountingCode: string,
    data: UpdateAccountingCodeRequest
  ): Promise<UpdatedAccountingCode> {
    try {
      // Validate request payload
      const validatedData = updateAccountingCodeRequestSchema.parse(data);

      // Make PUT request
      const response = await this.axiosInstance.put<UpdateAccountingCodeResponse>(
        this.endpoints.updateAccountingCodeV1,
        validatedData
      );

      // Validate response structure
      const validatedResponse = updateAccountingCodeResponseSchema.parse(response.data);

      // Check success flag
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.message || 'Failed to update accounting code');
      }

      return validatedResponse.data;
    } catch (error) {
      // Handle and normalize errors
      throw AccountingCodeApiService.normalizeError(error);
    }
  }

  /**
   * Get accounting codes list with pagination (v1 API)
   * @param params - Query parameters for pagination, search, and sorting
   * @returns Promise resolving to paginated accounting codes data
   * @throws {Error} When API returns an error response
   * @throws {Error} When network request fails
   */
  async getAccountingCodesListV1(params?: GetAccountingCodesListParams): Promise<GetAccountingCodesListResponse> {
    try {
      // Make GET request with query parameters
      const response = await this.axiosInstance.get<GetAccountingCodesListResponse>(
        this.endpoints.getAccountingCodesListV1,
        {params}
      );

      // Validate response structure
      const validatedResponse = getAccountingCodesListResponseSchema.parse(response.data);

      // Check success flag
      if (!validatedResponse.success) {
        throw new Error(validatedResponse.message || 'Failed to retrieve accounting codes');
      }

      return validatedResponse;
    } catch (error) {
      // Handle and normalize errors
      throw AccountingCodeApiService.normalizeError(error);
    }
  }

  /**
   * Normalize errors for consistent handling
   * @param error - The caught error
   * @returns Normalized error object
   */
  private static normalizeError(error: unknown): Error {
    // Zod validation error
    if (error instanceof z.ZodError) {
      const messages = error.issues.map((err) => `${err.path.join('.')}: ${err.message}`);
      return new Error(`Validation failed: ${messages.join(', ')}`);
    }

    // Axios error
    if (axios.isAxiosError(error)) {
      const {response} = error;

      // API error response
      if (response?.data) {
        const apiError = response.data as ApiErrorResponse;
        return new Error(apiError.errorCodeDes || apiError.message || 'API request failed');
      }

      // Network error
      if (error.code === 'ECONNABORTED') {
        return new Error('Request timeout - please try again');
      }

      if (!error.response) {
        return new Error('Network error - please check your connection');
      }

      // HTTP status errors
      if (response?.status) {
        if (response.status >= 500) {
          return new Error('Server error - please try again later');
        }
        if (response.status === 401) {
          return new Error('Unauthorized - please log in again');
        }
        if (response.status === 403) {
          return new Error('Forbidden - you do not have permission');
        }
        if (response.status === 404) {
          return new Error('Endpoint not found');
        }
      }
    }

    // Unknown error
    if (error instanceof Error) {
      return error;
    }

    return new Error('An unexpected error occurred');
  }
}
