/* eslint-disable no-console */
import axios, {AxiosError} from 'axios';

import type {GenerateScheduleData} from '../components/generate-schedule-dialog';

import type {
  BillCycleApiResponse,
  BillCyclesApiResponse,
  GetBillCyclesParams,
  BillCycleCreateRequest,
  BillCycleUpdateRequest
} from './bill-cycle-api.types';
import type {ApiError} from './lookup-api.types';

// ========================================
// LOOKUP API TYPES
// ========================================

/** Lookup value from API */
interface LookupValueApi {
  id: {
    field: string;
    fieldVal: string;
  };
  disableDisplaySw: 'Y' | 'N';
  displayName: string;
  createdBy: string;
  creationDttm: string;
  modifiedBy: string | null;
  modifiedDttm: string;
  version: number | null;
  notes: string | null;
}

/** Lookup field data from API */
interface LookupFieldApi {
  field: string;
  description: string;
  systemSw: boolean;
  numericSw: boolean;
  javaFieldName: string;
  createdBy: string;
  creationDttm: string;
  modifiedBy: string | null;
  modifiedDttm: string;
  version: number | null;
  ownerFlg: string | null;
  fieldLength: number;
  values: LookupValueApi[];
  extensions: unknown[];
}

/** Lookup search response from API */
interface LookupSearchResponse {
  content: LookupFieldApi[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/** Bill period option type */
export interface BillPeriodOption {
  value: string;
  label: string;
}

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

// ========================================
// AXIOS INSTANCE CONFIGURATION
// ========================================

/** Axios instance with default configuration */
const billCycleApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
  withCredentials: false
});

// Add request interceptor for debugging
if (billCycleApiClient?.interceptors) {
  billCycleApiClient.interceptors.request.use(
    (config) => {
      return config;
    },
    async (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  billCycleApiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      console.error('Bill Cycle API Error:', error.message, error.config?.url);
      return Promise.reject(error);
    }
  );
}

// ========================================
// ERROR HANDLER UTILITY
// ========================================

/** Error handler utility */
const handleApiError = (error: AxiosError): never => {
  const apiError: ApiError = {
    message: error.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN_ERROR',
    details: error.response?.data as Record<string, unknown>
  };
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw apiError;
};

// ========================================
// API SERVICE METHODS
// ========================================

/** Type definition for Bill Cycle API service */
export interface BillCycleApiService {
  getBillCycles: (params: GetBillCyclesParams) => Promise<{billCycles: BillCycleApiResponse[]; count: number}>;
  getBillCycleById: (billCycleCode: string) => Promise<BillCycleApiResponse | null>;
  createBillCycle: (billCycle: BillCycleCreateRequest) => Promise<BillCycleApiResponse>;
  updateBillCycle: (billCycle: BillCycleUpdateRequest) => Promise<BillCycleApiResponse>;
  deleteBillCycle: (billCycleCode: string) => Promise<void>;
  getBillPeriodTypes: () => Promise<BillPeriodOption[]>;
  generateBillCycleSchedule: (data: GenerateScheduleData) => Promise<any>;
}

export const billCycleApiService: BillCycleApiService = {
  /**
   * Get all Bill Cycles with pagination and filters
   * @param params - Query parameters including page, size, and filters
   * @returns Response with billCycles array and count
   */
  getBillCycles: async ({
    page = 0,
    size = 10,
    billCycleCode,
    status,
    billPeriodCode,
    description
  }: GetBillCyclesParams): Promise<{billCycles: BillCycleApiResponse[]; count: number}> => {
    try {
      // Build query params, only including non-empty values
      const params: Record<string, string | number> = {
        page,
        size
      };

      if (billCycleCode?.trim()) {
        params['billCycleCode'] = billCycleCode.trim();
      }
      if (status?.trim()) {
        params['status'] = status.trim();
      }
      if (billPeriodCode?.trim()) {
        params['billPeriodCode'] = billPeriodCode.trim();
      }
      if (description?.trim()) {
        params['description'] = description.trim();
      }

      const response = await billCycleApiClient.get<BillCyclesApiResponse>('/admin/v1/billcycle', {
        params
      });

      // Return raw API data without mapping
      const billCycles = response.data.data.data;
      const {totalRecord} = response.data.data;

      return {billCycles, count: totalRecord};
    } catch (error) {
      console.error('getBillCycles error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get a single Bill Cycle by billCycleCode
   * @param billCycleCode - The Bill Cycle Code
   * @returns BillCycleApiResponse object or null
   */
  getBillCycleById: async (billCycleCode: string): Promise<BillCycleApiResponse | null> => {
    try {
      const response = await billCycleApiClient.get<BillCycleApiResponse>(`/admin/v1/billcycle/${billCycleCode}`);

      if (response.status !== 200) {
        console.error('Failed to fetch Bill Cycle data', response);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error('getBillCycleById error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Create a new Bill Cycle
   * @param data - Bill Cycle creation data
   * @returns Created BillCycleApiResponse object
   */
  createBillCycle: async (data: BillCycleCreateRequest): Promise<BillCycleApiResponse> => {
    try {
      const response = await billCycleApiClient.post<BillCycleApiResponse>('/admin/v1/billcycle', data);
      return response.data;
    } catch (error) {
      console.error('createBillCycle error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Update an existing Bill Cycle
   * @param data - Updated Bill Cycle data
   * @returns Updated BillCycleApiResponse object
   */
  updateBillCycle: async (data: BillCycleUpdateRequest): Promise<BillCycleApiResponse> => {
    try {
      const response = await billCycleApiClient.put<BillCycleApiResponse>('/admin/v1/billcycle', data);
      return response.data;
    } catch (error) {
      console.error('updateBillCycle error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Delete a Bill Cycle by billCycleCode
   * @param billCycleCode - The Bill Cycle Code to delete
   * @returns Success response
   */
  deleteBillCycle: async (billCycleCode: string): Promise<void> => {
    try {
      await billCycleApiClient.delete(`/admin/v1/billcycle/${billCycleCode}`);
    } catch (error) {
      console.error('deleteBillCycle error:', error);
      handleApiError(error as AxiosError);
    }
  },

  /**
   * Get bill period types from lookup API
   * @returns Array of bill period options with label format "name (code)"
   */
  getBillPeriodTypes: async (): Promise<BillPeriodOption[]> => {
    try {
      const response = await billCycleApiClient.post<LookupSearchResponse>('/api/lookups/search', {
        field: 'BILL_PERIOD',
        page: 0,
        size: 10
      });

      if (!response.data.content || response.data.content.length === 0) {
        console.error('Failed to fetch bill period types', response);
        return [];
      }

      // Get the first item from content array and filter enabled values
      const lookupField = response.data.content[0];
      if (!lookupField?.values) {
        console.error('No values found in lookup field', response);
        return [];
      }

      return lookupField.values
        .filter((value) => value.disableDisplaySw === 'N')
        .map((value) => ({
          value: value.id.fieldVal,
          label: `${value.displayName} (${value.id.fieldVal})`
        }));
    } catch (error) {
      console.error('getBillPeriodTypes error:', error);
      // Return empty array instead of throwing to allow graceful degradation
      return [];
    }
  },

  /**
   * Generate bill cycle schedule based on parameters
   * @param data - Generate schedule data with period, dates, and days configuration
   * @returns Response from the API
   */
  generateBillCycleSchedule: async (data: GenerateScheduleData): Promise<any> => {
    try {
      const response = await billCycleApiClient.post('/admin/v1/billcycle/generatBillCycle', data);
      return response.data;
    } catch (error) {
      console.error('generateBillCycleSchedule error:', error);
      return handleApiError(error as AxiosError);
    }
  }
};
