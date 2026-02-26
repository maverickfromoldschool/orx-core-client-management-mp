/* eslint-disable no-console */
import axios, {AxiosError} from 'axios';

import type {UnitOfMeasureData} from '../components/uom-table';
import type {UnitTypeOption} from '../uom-dialog';

import type {UomApiResponse, UomsApiResponse, GetUomsParams} from './uom-api.types';
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

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

// ========================================
// AXIOS INSTANCE CONFIGURATION
// ========================================

/** Axios instance with default configuration */
const uomApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
  withCredentials: false
});

// Add request interceptor for debugging
if (uomApiClient?.interceptors) {
  uomApiClient.interceptors.request.use(
    (config) => {
      return config;
    },
    async (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  uomApiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      console.error('UOM API Error:', error.message, error.config?.url);
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

/** Type definition for UOM API service */
export interface UomApiService {
  getUoms: (params: GetUomsParams) => Promise<{uoms: UnitOfMeasureData[]; count: number}>;
  getUomById: (id: string) => Promise<UnitOfMeasureData | null>;
  createUom: (uom: UnitOfMeasureData) => Promise<UnitOfMeasureData>;
  updateUom: (uom: UnitOfMeasureData) => Promise<UnitOfMeasureData>;
  deleteUom: (id: string) => Promise<void>;
  getUnitTypes: () => Promise<UnitTypeOption[]>;
}

export const uomApiService: UomApiService = {
  /**
   * Get all UOMs with pagination and filters
   * @param params - Query parameters including page, size, and filters
   * @returns Response with uoms array and count
   */
  getUoms: async ({
    page = 0,
    size = 10,
    uom,
    description,
    decimals,
    unitTypeCd,
    appendToQuantity
  }: GetUomsParams): Promise<{uoms: UnitOfMeasureData[]; count: number}> => {
    try {
      // Build query params, only including non-empty values
      const params: Record<string, string | number> = {
        page,
        size
      };

      if (uom?.trim()) {
        params['uom'] = uom.trim();
      }
      if (description?.trim()) {
        params['description'] = description.trim();
      }
      if (decimals !== undefined && decimals !== null) {
        params['decimals'] = decimals;
      }
      if (unitTypeCd?.trim()) {
        params['unitTypeCd'] = unitTypeCd.trim();
      }
      if (appendToQuantity?.trim()) {
        params['appendToQuantity'] = appendToQuantity.trim();
      }

      const response = await uomApiClient.get<UomsApiResponse>('/admin/v1/uom', {
        params
      });

      const uoms = response.data.data.data;
      const count = response.data.data.totalRecord;

      return {uoms, count};
    } catch (error) {
      console.error('getUoms error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get a single UOM by ID
   * @param id - The UOM ID (uom field)
   * @returns UnitOfMeasureData object or null
   */
  getUomById: async (id: string): Promise<UnitOfMeasureData | null> => {
    try {
      const response = await uomApiClient.get<{success: boolean; data: UomApiResponse; message: string}>(`/uom/${id}`);

      if (response.status !== 200 || !response.data.success) {
        console.error('Failed to fetch UOM data', response);
        return null;
      }

      return response.data.data;
    } catch (error) {
      console.error('getUomById error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Create a new UOM
   * @param data - UOM creation data
   * @returns Created UnitOfMeasureData object
   */
  createUom: async (data: UnitOfMeasureData): Promise<UnitOfMeasureData> => {
    try {
      const response = await uomApiClient.post<{data: UomApiResponse}>('/admin/v1/uom', data);
      return response.data.data;
    } catch (error) {
      console.error('createUom error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Update an existing UOM
   * @param data - Updated UOM data
   * @returns Updated UnitOfMeasureData object
   */
  updateUom: async (data: UnitOfMeasureData): Promise<UnitOfMeasureData> => {
    try {
      const response = await uomApiClient.put<{success: boolean; data: UomApiResponse; message: string}>(
        `/admin/v1/uom`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error('updateUom error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Delete a UOM by ID
   * @param id - The UOM ID (uom field) to delete
   * @returns Success response
   */
  deleteUom: async (id: string): Promise<void> => {
    try {
      await uomApiClient.delete(`/admin/v1/uom/${id}`);
    } catch (error) {
      console.error('deleteUom error:', error);
      handleApiError(error as AxiosError);
    }
  },

  /**
   * Get unit types from lookup API
   * @returns Array of unit type options with label format "name (code)"
   */
  getUnitTypes: async (): Promise<UnitTypeOption[]> => {
    try {
      const response = await uomApiClient.post<LookupSearchResponse>('/api/lookups/search', {
        field: 'UNIT_TYPE_CD',
        page: 0,
        size: 10
      });

      if (!response.data.content || response.data.content.length === 0) {
        console.error('Failed to fetch unit types', response);
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
      console.error('getUnitTypes error:', error);
      // Return empty array instead of throwing to allow graceful degradation
      return [];
    }
  }
};
