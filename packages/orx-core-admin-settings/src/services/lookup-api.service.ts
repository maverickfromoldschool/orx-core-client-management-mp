/* eslint-disable no-console */
import {AxiosError} from 'axios';
import {apiClient} from '@optum-rx-core/orx-core-axios';

import type {
  LookupField,
  LookupFieldApi,
  LookupFieldValue,
  LookupFieldValueApi,
  LookupFieldValueRequest,
  LookupFieldCreateRequest,
  LookupFieldUpdateRequest,
  LookupFieldSearchResponse,
  ApiError
} from './lookup-api.types';

// ========================================
// MAPPER FUNCTIONS
// ========================================

/**
 * Maps API lookup field value to UI format
 */
const mapApiValueToUiValue = (apiValue: LookupFieldValueApi): LookupFieldValue => ({
  id: `${apiValue.id.field}-${apiValue.id.fieldVal}`,
  fieldValue: apiValue.id.fieldVal,
  displayName: apiValue.displayName || apiValue.id.fieldVal,
  description: apiValue.notes || undefined,
  disabled: apiValue.disableDisplaySw === 'Y'
});

/**
 * Maps UI lookup field value to API request format
 */
const mapUiValueToApiValue = (uiValue: LookupFieldValue): LookupFieldValueRequest => ({
  fieldVal: uiValue.fieldValue,
  disableDisplaySw: uiValue.disabled ? 'Y' : 'N',
  displayName: uiValue.displayName,
  notes: uiValue.description
});

/**
 * Maps API lookup field to UI format
 */
const mapApiFieldToUiField = (apiField: LookupFieldApi): LookupField => ({
  id: apiField.field,
  lookupField: apiField.field,
  displayName: apiField.description,
  managedBy: apiField.systemSw ? 'System' : 'User',
  numericValue: apiField.numericSw,
  maxStoredValueLength: String(apiField.fieldLength || ''),
  values: apiField.values?.map(mapApiValueToUiValue) || []
});

/**
 * Maps UI lookup field to API create request format
 */
const mapUiFieldToCreateRequest = (uiField: Partial<LookupField>, createdBy: string): LookupFieldCreateRequest => ({
  field: uiField.lookupField || '',
  description: uiField.displayName || '',
  systemSw: uiField.managedBy === 'System',
  numericSw: uiField.numericValue || false,
  javaFieldName: uiField.lookupField || '',
  createdBy,
  fieldLength: uiField.maxStoredValueLength ? parseInt(uiField.maxStoredValueLength, 10) : undefined,
  values: uiField.values?.map(mapUiValueToApiValue)
});

/**
 * Maps UI lookup field to API update request format
 */
const mapUiFieldToUpdateRequest = (uiField: Partial<LookupField>, modifiedBy: string): LookupFieldUpdateRequest => ({
  description: uiField.displayName || '',
  systemSw: uiField.managedBy === 'System',
  numericSw: uiField.numericValue || false,
  javaFieldName: uiField.lookupField || '',
  modifiedBy,
  fieldLength: uiField.maxStoredValueLength ? parseInt(uiField.maxStoredValueLength, 10) : undefined,
  values: uiField.values?.map(mapUiValueToApiValue)
});

// ========================================
// AXIOS INSTANCE CONFIGURATION
// ========================================

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

export const lookupApiService = {
  // ========================================
  // GET METHODS - Retrieve/Search Data
  // ========================================

  /**
   * Search/list all lookup fields with pagination
   * @param page - Page number (0-indexed for API)
   * @param size - Page size (default: 10)
   * @returns Paginated response with lookup fields
   */
  searchLookupFields: async ({
    page = 0,
    size = 10,
    field = ''
  }: {
    page?: number;
    size?: number;
    field?: string;
  }): Promise<{fields: LookupField[]; totalElements: number; totalPages: number}> => {
    try {
      const requestBody = {
        page,
        size,
        field
      };
      console.log('searchLookupFields request body:', requestBody);
      const response = await apiClient.post<LookupFieldSearchResponse>('/api/lookups/search', requestBody);
      console.log('searchLookupFields response:', response.data);
      console.log('searchLookupFields page data:', response.data.page);

      return {
        fields: response.data.content.map(mapApiFieldToUiField),
        totalElements: response.data.page.totalElements,
        totalPages: response.data.page.totalPages
      };
    } catch (error) {
      console.error('searchLookupFields error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get a single lookup field by ID
   * @param id - The lookup field ID (field name)
   * @returns Lookup field object or null
   */
  getLookupFieldById: async (id: string): Promise<LookupField | null> => {
    try {
      const response = await apiClient.get<LookupFieldApi>(`/api/lookups/${id}`);

      if (response.status !== 200) {
        console.error('Failed to fetch lookup field data', response);
        return null;
      }

      return mapApiFieldToUiField(response.data);
    } catch (error) {
      console.error('getLookupFieldById error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  // ========================================
  // POST METHODS - Create Data
  // ========================================

  /**
   * Create a new lookup field
   * @param data - Lookup field UI data
   * @param createdBy - User creating the lookup
   * @returns Created lookup field object
   */
  createLookupField: async (data: Partial<LookupField>, createdBy: string): Promise<LookupField> => {
    try {
      const requestData = mapUiFieldToCreateRequest(data, createdBy);
      const response = await apiClient.post<LookupFieldApi>('/api/lookups', requestData);
      return mapApiFieldToUiField(response.data);
    } catch (error) {
      console.error('createLookupField error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  // ========================================
  // PUT METHODS - Update Data
  // ========================================

  /**
   * Update an existing lookup field
   * @param id - The lookup field ID (field name) to update
   * @param data - Updated lookup field UI data
   * @param modifiedBy - User modifying the lookup
   * @returns Updated lookup field object
   */
  updateLookupField: async (id: string, data: Partial<LookupField>, modifiedBy: string): Promise<LookupField> => {
    try {
      const requestData = mapUiFieldToUpdateRequest(data, modifiedBy);
      const response = await apiClient.put<LookupFieldApi>(`/api/lookups/${id}`, requestData);
      return mapApiFieldToUiField(response.data);
    } catch (error) {
      console.error('updateLookupField error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  // ========================================
  // DELETE METHODS - Delete Data
  // ========================================

  /**
   * Delete a lookup field by ID
   * @param id - The lookup field ID (field name) to delete
   * @returns Success response
   */
  deleteLookupField: async (id: string): Promise<{success: boolean; message: string}> => {
    try {
      await apiClient.delete(`/api/lookups/${id}`);
      return {success: true, message: 'Lookup field deleted successfully'};
    } catch (error) {
      console.error('deleteLookupField error:', error);
      return handleApiError(error as AxiosError);
    }
  }
};

export default lookupApiService;
