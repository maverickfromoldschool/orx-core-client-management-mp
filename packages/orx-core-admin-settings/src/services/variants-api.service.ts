/* eslint-disable no-console */
import axios, {AxiosError} from 'axios';

import type {VariantData} from '../components/variant-dialog.types';

import type {
  VariantApiResponse,
  VariantCreateRequest,
  VariantUpdateRequest,
  VariantsApiResponse,
  GetVariantsParams
} from './variants-api.types';
import type {ApiError} from './lookup-api.types';

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

// ========================================
// MAPPER FUNCTIONS
// ========================================

/**
 * Maps API response to UI VariantData format
 * @param apiVariant - Variant from API response
 * @returns VariantData for UI consumption
 */
const mapApiResponseToVariantData = (apiVariant: VariantApiResponse): VariantData => ({
  id: apiVariant.variant, // Using variant field as unique identifier
  variantField: apiVariant.variant,
  variantName: apiVariant.name,
  dataType: apiVariant.dataType,
  systemDefined: apiVariant.systemDefinedLookup === 'Y',
  predefined: apiVariant.predefinedSw === 'Y',
  relatedEntity: apiVariant.entity,
  attribute: apiVariant.attribute || '',
  fieldType: apiVariant.fieldType || '',
  field: apiVariant.predefinedField || '',
  notes: apiVariant.notes,
  variantValues:
    apiVariant.variantValues?.map((vv) => ({
      id: `${vv.variant}-${vv.variantValue}`,
      value: vv.variantValue,
      description: vv.description
    })) || []
});

/**
 * Maps UI VariantData to API create request format
 * @param variantData - VariantData from UI
 * @param createdBy - User creating the variant
 * @returns VariantCreateRequest for API
 */
const mapVariantDataToCreateRequest = (variantData: VariantData, createdBy: string): VariantCreateRequest => ({
  variant: variantData.variantField,
  name: variantData.variantName,
  dataType: variantData.dataType.substring(0, 3),
  systemDefinedLookup: variantData.systemDefined ? 'Y' : 'N',
  predefinedSw: variantData.predefined ? 'Y' : 'N',
  entity: variantData.relatedEntity || '',
  attribute: variantData.attribute || '',
  attributeName: variantData.attributeName || '',
  fieldType: variantData.fieldType || '',
  predefinedField: variantData.field || '',
  notes: variantData.notes,
  applyToAttribute: 'N',
  createdBy,
  modifiedBy: createdBy,
  variantValues: variantData.variantValues?.map((vv) => ({
    variant: variantData.variantField,
    variantValue: vv.value,
    description: vv.description,
    createdBy,
    modifiedBy: createdBy
  }))
});

/**
 * Maps UI VariantData to API update request format
 * @param variantData - VariantData from UI
 * @param modifiedBy - User modifying the variant
 * @param createdBy - Original creator (preserved from existing record)
 * @returns VariantUpdateRequest for API
 */
const mapVariantDataToUpdateRequest = (
  variantData: VariantData,
  modifiedBy: string,
  createdBy: string
): VariantUpdateRequest => ({
  variant: variantData.variantField,
  name: variantData.variantName,
  dataType: variantData.dataType.substring(0, 3), // Ensure max 3 characters
  systemDefinedLookup: variantData.systemDefined ? 'Y' : 'N',
  predefinedSw: variantData.predefined ? 'Y' : 'N',
  entity: variantData.relatedEntity || null,
  attribute: variantData.attribute || '',
  attributeName: variantData.attributeName || '',
  fieldType: variantData.fieldType || null,
  predefinedField: variantData.field || null,
  notes: variantData.notes,
  applyToAttribute: 'N',
  createdBy,
  modifiedBy,
  variantValues: variantData.variantValues?.map((vv) => ({
    variant: variantData.variantField,
    variantValue: vv.value,
    description: vv.description,
    createdBy,
    modifiedBy
  }))
});

// ========================================
// AXIOS INSTANCE CONFIGURATION
// ========================================

/** Axios instance with default configuration */
const variantsApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
  withCredentials: false
});

// Add request interceptor for debugging
if (variantsApiClient?.interceptors) {
  variantsApiClient.interceptors.request.use(
    (config) => {
      return config;
    },
    async (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  variantsApiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      console.error('Variants API Error:', error.message, error.config?.url);
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

/** Type definition for variants API service */
export interface VariantsApiService {
  getVariants: (params: GetVariantsParams) => Promise<{variants: VariantData[]; count: number}>;
  getVariantById: (id: string) => Promise<VariantData | null>;
  createVariant: (variant: VariantData, createdBy: string) => Promise<VariantData>;
  updateVariant: (id: string, variant: VariantData, modifiedBy: string) => Promise<VariantData>;
  deleteVariant: (id: string) => Promise<void>;
}

export const variantsApiService: VariantsApiService = {
  /**
   * Get all variants with pagination and filters
   * @param params - Query parameters including page, size, and filters
   * @returns Response with variants array and count
   */
  getVariants: async ({
    page = 0,
    size = 10,
    variantField,
    variantName,
    systemDefined,
    predefinedList,
    entity,
    isIgnoreChildEntities = 'Y'
  }: GetVariantsParams): Promise<{variants: VariantData[]; count: number}> => {
    try {
      // Build query params, only including non-empty values
      const params: Record<string, string | number> = {
        page,
        size,
        isIgnoreChildEntities
      };

      if (variantField?.trim()) {
        params['variantField'] = variantField.trim();
      }
      if (variantName?.trim()) {
        params['variantName'] = variantName.trim();
      }
      if (systemDefined) {
        params['systemDefined'] = systemDefined;
      }
      if (predefinedList) {
        params['predefinedList'] = predefinedList;
      }
      if (entity?.trim()) {
        params['entity'] = entity.trim();
      }

      const response = await variantsApiClient.get<VariantsApiResponse>('/variant', {
        params
      });
      console.log('getVariants response:', response.data);

      // Map API response to UI format
      const apiData = response.data.data.data;
      const variants = apiData.map(mapApiResponseToVariantData);
      const count = response.data.data.totalRecord;

      console.log('Mapped variants:', variants);
      console.log('Total count:', count);

      return {variants, count};
    } catch (error) {
      console.error('getVariants error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get a single variant by ID
   * @param id - The variant ID (variant field)
   * @returns VariantData object or null
   */
  getVariantById: async (id: string): Promise<VariantData | null> => {
    try {
      const response = await variantsApiClient.get<{success: boolean; data: VariantApiResponse; message: string}>(
        `/variant/${id}`
      );

      if (response.status !== 200 || !response.data.success) {
        console.error('Failed to fetch variant data', response);
        return null;
      }

      return mapApiResponseToVariantData(response.data.data);
    } catch (error) {
      console.error('getVariantById error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Create a new variant
   * @param data - Variant creation data
   * @param createdBy - User creating the variant
   * @returns Created VariantData object
   */
  createVariant: async (data: VariantData, createdBy: string): Promise<VariantData> => {
    try {
      const requestData = mapVariantDataToCreateRequest(data, createdBy);
      console.log('Creating variant with data:', requestData);
      const response = await variantsApiClient.post<{data: VariantApiResponse}>('/variant', requestData);
      console.log('createVariant response:', response.data);
      return mapApiResponseToVariantData(response.data.data);
    } catch (error) {
      console.error('createVariant error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Update an existing variant
   * @param id - The variant ID (variant field) to update
   * @param data - Updated variant data
   * @param modifiedBy - User modifying the variant
   * @returns Updated VariantData object
   */
  updateVariant: async (id: string, data: VariantData, modifiedBy: string): Promise<VariantData> => {
    try {
      // First, fetch the existing variant to get createdBy
      const existingVariantResponse = await variantsApiClient.get<{
        success: boolean;
        data: VariantApiResponse;
        message: string;
      }>(`/variant/${id}`);
      const createdBy = existingVariantResponse.data.data.createdBy || modifiedBy;

      const requestData = mapVariantDataToUpdateRequest(data, modifiedBy, createdBy);
      console.log('Updating variant with ID:', id, 'data:', requestData);
      const response = await variantsApiClient.put<{success: boolean; data: VariantApiResponse; message: string}>(
        `/variant`,
        requestData
      );
      console.log('updateVariant response:', response.data);
      return mapApiResponseToVariantData(response.data.data);
    } catch (error) {
      console.error('updateVariant error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Delete a variant by ID
   * @param id - The variant ID (variant field) to delete
   * @returns Success response
   */
  deleteVariant: async (id: string): Promise<void> => {
    try {
      console.log('Deleting variant with ID:', id);
      await variantsApiClient.delete(`/variant/${id}`);
      console.log('deleteVariant success');
    } catch (error) {
      console.error('deleteVariant error:', error);
      handleApiError(error as AxiosError);
    }
  }
};
