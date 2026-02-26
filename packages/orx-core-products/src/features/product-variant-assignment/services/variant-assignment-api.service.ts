/* eslint-disable no-console */
import axios, {AxiosError} from 'axios';

import {VariantAssignment, VariantAssignmentFormData, VariantAssignmentResponse} from '../types';

import type {
  ProductVariantApiResponse,
  ProductVariantListApiResponse,
  VariantOption,
  CreateVariantAssignmentRequest,
  UpdateVariantAssignmentRequest,
  GetVariantAssignmentsParams,
  BulkDeleteRequest,
  BulkDeleteResponse,
  ApiError
} from './variant-assignment-api.types';

// API Base URL - matching the client-api.service pattern
const API_BASE_URL = 'https://coreweb-dev-api.optum.com';

// Product variant endpoint for fetching assigned variants
const PRODUCT_VARIANT_ENDPOINT = '/product-variant/getAllAssignedProductVariantsByProductId';

// Product group endpoint for fetching product group variants
const PRODUCT_GROUP_ENDPOINT = '/admin/v1/productGroup';

// Variant details endpoint for fetching variant by ID
const VARIANT_DETAILS_ENDPOINT = '/variant';

// Lookups endpoint for fetching data types
const LOOKUPS_ENDPOINT = '/api/lookups/search';

// Create endpoint for variant assignment
const VARIANT_CREATE_ENDPOINT = '/product-variant/assignProductVariant';

// Update endpoint for variant assignment
const VARIANT_UPDATE_ENDPOINT = '/product-variant/updateAssignedProductVariant';

// Delete endpoint for variant assignment
const VARIANT_DELETE_ENDPOINT = '/product-variant/deleteAssignedProductVariantById';

// Placeholder endpoint for bulk delete - to be updated when provided
const VARIANT_BULK_DELETE_ENDPOINT = '/product/variant/bulk-delete'; // TODO: Update with actual endpoint

// ========================================
// MAPPER FUNCTIONS
// ========================================

/**
 * Maps API response to UI VariantAssignment format
 * Note: API returns variant as NAME (e.g., "Balance Requirement") because that's what we send in create/update
 * The form component will resolve this NAME back to CODE (e.g., "BALREQ") for dropdown matching
 * defaultValue is mapped from variantValue field in API response
 */
const mapApiResponseToVariantAssignment = (apiData: ProductVariantApiResponse): VariantAssignment => {
  return {
    id: apiData.productVariantId,
    variantField: apiData.variant, // This is the NAME: "Balance Requirement" - will be resolved to CODE by form
    defaultValue: apiData.variantValue || '', // Map from variantValue field in API response
    dataType: apiData.dataType || undefined,
    priorityOrder: apiData.priorityOrder,
    transactionProcessing: apiData.transactionProcessing === 'Y',
    priceDetermination: apiData.priceDetermination === 'Y',
    startDate: apiData.startDate,
    endDate: apiData.endDate,
    variantValues:
      apiData.variantValues?.map((vv) => ({
        value: vv.value,
        description: vv.description
      })) || [],
    productCode: apiData.productCode,
    createdBy: apiData.createdBy || undefined,
    createdDate: apiData.createdDate,
    lastModifiedBy: apiData.modifiedBy || undefined,
    lastModifiedDate: apiData.modifiedDate
  };
};

/**
 * Maps UI form data to API create request format
 * variant = name from API (e.g., "Balance Requirement")
 * variantValue = variant code (e.g., "BALREQ")
 */
const mapFormDataToCreateRequest = (
  data: VariantAssignmentFormData,
  productId: string,
  selectedVariant?: VariantOption
): CreateVariantAssignmentRequest => {
  // Normalize dataType: STR for string, NUM for number
  let normalizedDataType = data.dataType?.toUpperCase() || 'STR';
  if (
    normalizedDataType === 'NBR' ||
    normalizedDataType === 'DEC' ||
    normalizedDataType === 'NUMBER' ||
    normalizedDataType === 'STRING'
  ) {
    if (normalizedDataType === 'STRING') {
      normalizedDataType = 'STR';
    } else {
      normalizedDataType = 'NUM';
    }
  }

  return {
    variant: selectedVariant?.variantName || data.variantField, // Name: "Balance Requirement"
    variantValue: data.defaultValue || '', // Use the selected default value from form
    dataType: normalizedDataType,
    priorityOrder: typeof data.priorityOrder === 'string' ? parseInt(data.priorityOrder, 10) : data.priorityOrder,
    startDate: data.startDate ? `${data.startDate.split('T')[0]}T00:00:00` : null,
    endDate: data.endDate ? `${data.endDate.split('T')[0]}T00:00:00` : null,
    priceDetermination: data.priceDetermination ? 'Y' : 'N',
    transactionProcessing: data.transactionProcessing ? 'Y' : 'N',
    productId
  };
};

/**
 * Maps UI form data to API update request format
 * variant = name from API (e.g., "Balance Requirement")
 * variantValue = variant code (e.g., "BALREQ")
 */
const mapFormDataToUpdateRequest = (
  data: VariantAssignmentFormData,
  productId: string,
  id: string,
  selectedVariant?: VariantOption
): UpdateVariantAssignmentRequest => {
  // Normalize dataType: STR for string, NUM for number
  let normalizedDataType = data.dataType?.toUpperCase() || 'STR';
  if (
    normalizedDataType === 'NBR' ||
    normalizedDataType === 'DEC' ||
    normalizedDataType === 'NUMBER' ||
    normalizedDataType === 'STRING'
  ) {
    if (normalizedDataType === 'STRING') {
      normalizedDataType = 'STR';
    } else {
      normalizedDataType = 'NUM';
    }
  }

  return {
    variant: selectedVariant?.variantName || data.variantField, // Name: "Balance Requirement"
    variantValue: data.defaultValue || '', // Use the selected default value from form
    dataType: normalizedDataType,
    priorityOrder: typeof data.priorityOrder === 'string' ? parseInt(data.priorityOrder, 10) : data.priorityOrder,
    startDate: data.startDate ? `${data.startDate.split('T')[0]}T00:00:00` : null,
    endDate: data.endDate ? `${data.endDate.split('T')[0]}T00:00:00` : null,
    priceDetermination: data.priceDetermination ? 'Y' : 'N',
    transactionProcessing: data.transactionProcessing ? 'Y' : 'N',
    productId,
    productVariantId: id
  };
};

// ========================================
// AXIOS INSTANCE CONFIGURATION
// ========================================

/**
 * Axios instance with default configuration
 */
const variantAssignmentApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
  withCredentials: false
});

// Add request interceptor for debugging
if (variantAssignmentApiClient?.interceptors) {
  variantAssignmentApiClient.interceptors.request.use(
    (config) => {
      return config;
    },
    async (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  variantAssignmentApiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      console.error('Variant Assignment API Error:', error.message, error.config?.url);
      return Promise.reject(error);
    }
  );
}

// ========================================
// ERROR HANDLER UTILITY
// ========================================

/**
 * Error handler utility
 */
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

/**
 * Type definition for variant assignment API service
 */
export interface VariantAssignmentApiService {
  getAllVariants: (productGroup: string) => Promise<VariantOption[]>;
  getVariantById: (variantId: string) => Promise<{
    dataType: string;
    variantValues: {value: string; description: string}[];
  }>;
  getDataTypes: () => Promise<{value: string; displayName: string}[]>;
  getVariantAssignments: (params: GetVariantAssignmentsParams) => Promise<VariantAssignmentResponse>;
  getVariantAssignmentById: (productId: string, id: string) => Promise<VariantAssignment | null>;
  createVariantAssignment: (
    productId: string,
    data: VariantAssignmentFormData,
    productGroup: string
  ) => Promise<VariantAssignment>;
  updateVariantAssignment: (
    productId: string,
    id: string,
    data: VariantAssignmentFormData,
    productGroup: string
  ) => Promise<VariantAssignment>;
  deleteVariantAssignment: (productId: string, id: string) => Promise<void>;
  bulkDeleteVariantAssignments: (productId: string, ids: string[]) => Promise<BulkDeleteResponse>;
}

export const variantAssignmentApiService: VariantAssignmentApiService = {
  /**
   * Get all available variants for dropdown from product group
   */
  getAllVariants: async (productGroup: string): Promise<VariantOption[]> => {
    try {
      const response = await variantAssignmentApiClient.get<{
        success: boolean;
        data: {
          productGroupVariantList: {
            variant: string;
            variantName: string | null;
          }[];
        };
        message: string;
      }>(`${PRODUCT_GROUP_ENDPOINT}/${productGroup}`);

      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to fetch product group variants');
      }

      // Map productGroupVariantList to dropdown options
      const mappedVariants = response.data.data.productGroupVariantList.map((variant) => {
        return {
          variant: variant.variant, // Variant code: "ACCOUNT"
          variantCode: variant.variant, // Variant code for payload
          variantName: variant.variantName || variant.variant, // Name or fallback to code
          dataType: 'STR', // Default to STR, will be populated from selected variant
          variantValues: [] // No predefined values from this endpoint
        };
      });

      console.log('Mapped variants from productGroup:', mappedVariants);
      return mappedVariants;
    } catch (error) {
      console.error('Error fetching product group variants:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get variant details by ID to fetch variant values
   */
  getVariantById: async (
    variantId: string
  ): Promise<{dataType: string; variantValues: {value: string; description: string}[]}> => {
    try {
      const response = await variantAssignmentApiClient.get<{
        success: boolean;
        data: {
          createdBy: string;
          modifiedBy: string;
          createdDate: string;
          modifiedDate: string;
          version: number;
          variant: string;
          name: string;
          notes: string | null;
          dataType: string;
          systemDefinedLookup: string;
          predefinedSw: string;
          fieldType: string | null;
          predefinedField: string | null;
          applyToAttribute: string;
          entity: string;
          attribute: string | null;
          variantValues: {
            variant: string;
            variantValue: string;
            description: string;
          }[];
        };
        message: string;
      }>(`${VARIANT_DETAILS_ENDPOINT}/${variantId}`);

      if (!response.data.success || !response.data.data) {
        throw new Error('Failed to fetch variant details');
      }

      const variantData = response.data.data;
      const mappedValues =
        variantData.variantValues?.map((vv) => ({
          value: vv.variantValue,
          description: vv.description
        })) || [];

      return {
        dataType: variantData.dataType || 'STR',
        variantValues: mappedValues
      };
    } catch (error) {
      console.error('Error fetching variant details:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get data types from lookups API
   */
  getDataTypes: async (): Promise<{value: string; displayName: string}[]> => {
    try {
      const response = await variantAssignmentApiClient.post<{
        content: {
          field: string;
          values: {
            id: {
              field: string;
              fieldVal: string;
            };
            disableDisplaySw: string;
            displayName: string;
            createdBy: string;
            creationDttm: string;
            modifiedBy: string;
            modifiedDttm: string;
            version: number | null;
            notes: string | null;
          }[];
        }[];
        page: {
          size: number;
          number: number;
          totalElements: number;
          totalPages: number;
        };
      }>(LOOKUPS_ENDPOINT, {
        page: 0,
        size: 10,
        field: 'DATA_TYPE'
      });

      if (!response.data.content || response.data.content.length === 0) {
        return [];
      }

      const dataTypeField = response.data.content[0];
      if (!dataTypeField?.values || dataTypeField.values.length === 0) {
        return [];
      }

      return dataTypeField.values.map((item) => ({
        value: item.id.fieldVal,
        displayName: item.displayName
      }));
    } catch (error) {
      console.error('Error fetching data types:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get all variant assignments with pagination and filters
   * Uses the getAllAssignedProductVariantsByProductId endpoint
   */
  getVariantAssignments: async ({
    productId,
    page = 0,
    size = 10,
    variantField,
    dataType,
    transactionProcessing,
    priceDetermination,
    startDate,
    endDate
  }: GetVariantAssignmentsParams): Promise<VariantAssignmentResponse> => {
    try {
      // Fetch assigned product variants
      const response = await variantAssignmentApiClient.get<ProductVariantListApiResponse>(
        `${PRODUCT_VARIANT_ENDPOINT}/${productId}`
      );

      if (!response.data.success) {
        throw new Error(response.data.data || 'Failed to fetch product variants');
      }

      // Map and paginate the variants
      let variants = response.data.message.map(mapApiResponseToVariantAssignment);

      // Apply filters
      if (variantField?.trim()) {
        variants = variants.filter((v) => v.variantField.toLowerCase().includes(variantField.toLowerCase()));
      }
      if (dataType?.trim()) {
        variants = variants.filter((v) => v.dataType?.toLowerCase().includes(dataType.toLowerCase()));
      }
      if (transactionProcessing !== undefined) {
        variants = variants.filter((v) => v.transactionProcessing === transactionProcessing);
      }
      if (priceDetermination !== undefined) {
        variants = variants.filter((v) => v.priceDetermination === priceDetermination);
      }
      if (startDate?.trim()) {
        variants = variants.filter((v) => v.startDate && v.startDate >= startDate);
      }
      if (endDate?.trim()) {
        variants = variants.filter((v) => v.endDate && v.endDate <= endDate);
      }

      // Apply pagination
      const totalCount = variants.length;
      const totalPages = Math.ceil(totalCount / size);
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedVariants = variants.slice(startIndex, endIndex);

      return {
        data: paginatedVariants,
        totalCount,
        currentPage: page + 1, // Convert back to 1-based
        totalPages,
        pageSize: size
      };
    } catch (error) {
      console.error('Error fetching variant assignments:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get variant assignment by ID
   * Note: Fetches all assigned variants and filters by ID
   * TODO: Update when direct variant fetch endpoint is available
   */
  getVariantAssignmentById: async (productId: string, id: string): Promise<VariantAssignment | null> => {
    try {
      const response = await variantAssignmentApiClient.get<ProductVariantListApiResponse>(
        `${PRODUCT_VARIANT_ENDPOINT}/${productId}`
      );

      console.log('getVariantAssignmentById response:', response.data);

      if (!response.data.success) {
        return null;
      }

      const variant = response.data.message.find((v) => v.productVariantId === id);

      return variant ? mapApiResponseToVariantAssignment(variant) : null;
    } catch (error) {
      console.error('Error fetching variant assignment by ID:', error);
      if ((error as AxiosError).response?.status === 404) {
        return null;
      }
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Create a new variant assignment
   */
  createVariantAssignment: async (
    productId: string,
    data: VariantAssignmentFormData,
    productGroup: string
  ): Promise<VariantAssignment> => {
    try {
      // Get all variants using productGroup
      const allVariants = await variantAssignmentApiService.getAllVariants(productGroup);
      // variantField might contain either code or name, try to find by code first, then name
      const selectedVariant = allVariants.find(
        (v) => v.variantCode === data.variantField || v.variantName === data.variantField
      );

      const requestBody = mapFormDataToCreateRequest(data, productId, selectedVariant);

      const response = await variantAssignmentApiClient.post<ProductVariantApiResponse>(
        VARIANT_CREATE_ENDPOINT,
        requestBody
      );

      return mapApiResponseToVariantAssignment(response.data);
    } catch (error) {
      console.error('Error creating variant assignment:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Update an existing variant assignment
   */
  updateVariantAssignment: async (
    productId: string,
    id: string,
    data: VariantAssignmentFormData,
    productGroup: string
  ): Promise<VariantAssignment> => {
    try {
      // Get all variants using productGroup
      const allVariants = await variantAssignmentApiService.getAllVariants(productGroup);
      // variantField might contain either code or name, try to find by code first, then name
      const selectedVariant = allVariants.find(
        (v) => v.variantCode === data.variantField || v.variantName === data.variantField
      );

      console.log('Update form data:', {
        formData: data,
        defaultValue: data.defaultValue,
        selectedVariant
      });

      const requestBody = mapFormDataToUpdateRequest(data, productId, id, selectedVariant);

      console.log('updateVariantAssignment request:', requestBody);

      const response = await variantAssignmentApiClient.put<ProductVariantApiResponse>(
        VARIANT_UPDATE_ENDPOINT,
        requestBody
      );

      return mapApiResponseToVariantAssignment(response.data);
    } catch (error) {
      console.error('Error updating variant assignment:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Delete a variant assignment
   */
  deleteVariantAssignment: async (productId: string, id: string): Promise<void> => {
    try {
      await variantAssignmentApiClient.delete(`${VARIANT_DELETE_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting variant assignment:', error);
      handleApiError(error as AxiosError);
    }
  },

  /**
   * Bulk delete variant assignments
   * TODO: Update endpoint when bulk delete API is provided
   */
  bulkDeleteVariantAssignments: async (productId: string, ids: string[]): Promise<BulkDeleteResponse> => {
    try {
      const requestBody: BulkDeleteRequest = {ids};

      const response = await variantAssignmentApiClient.post<BulkDeleteResponse>(
        `${VARIANT_BULK_DELETE_ENDPOINT}/${productId}`,
        requestBody
      );

      return response.data;
    } catch (error) {
      console.error('Error bulk deleting variant assignments:', error);
      return handleApiError(error as AxiosError);
    }
  }
};
