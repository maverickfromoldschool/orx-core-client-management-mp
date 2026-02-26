/* eslint-disable no-console */
import axios from 'axios';

import type {
  LookupExtensionApi,
  LookupExtensionCreateRequest,
  LookupExtensionUpdateRequest,
  LookupExtensionSearchResponse,
  LookupExtensionResponse,
  LookupExtensionDeleteResponse,
  LookupExtensionSearchParams,
  LookupExtensionUI,
  LookupExtensionFieldUI,
  LookupExtensionEntryUI,
  LookupExtensionFieldApi,
  LookupExtensionEntryApi,
  ApiError
} from './lookup-extension-api.types';

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

// ========================================
// MAPPER FUNCTIONS
// ========================================

/**
 * Maps API field to UI format
 */
const mapApiFieldToUiField = (apiField: LookupExtensionFieldApi, index: number): LookupExtensionFieldUI => ({
  id: apiField.element || `field-${index}`,
  element: apiField.element,
  displayName: apiField.fieldName || apiField.element,
  dataType: apiField.dataType,
  lookupCode: apiField.lookupCode || undefined,
  required: apiField.required || false,
  draft: false
});

/**
 * Maps API entry to UI format
 */
const mapApiEntryToUiEntry = (apiEntry: LookupExtensionEntryApi, index: number): LookupExtensionEntryUI => {
  const {lookupValue, ...values} = apiEntry;
  return {
    id: lookupValue || `entry-${index}`,
    lookupValue,
    values,
    draft: false
  };
};

/**
 * Maps API lookup extension to UI format
 */
export const mapApiToUi = (apiData: LookupExtensionApi): LookupExtensionUI => ({
  extensionId: apiData.extensionCode,
  displayName: apiData.name,
  lookupCode: apiData.field,
  systemDefined: apiData.systemSw === 'Y',
  userMapping: apiData.userMappingSw === 'Y',
  multipleOccurrences: apiData.multipleOccurrencesSw === 'Y',
  fields: apiData.jsonData?.fields?.map(mapApiFieldToUiField) || [],
  entries: apiData.jsonData?.entries?.map(mapApiEntryToUiEntry) || [],
  version: apiData.version,
  createdBy: apiData.createdBy,
  createdDate: apiData.createdDate,
  modifiedBy: apiData.modifiedBy,
  modifiedDate: apiData.modifiedDate
});

/**
 * Maps UI field to API format
 */
const mapUiFieldToApiField = (uiField: LookupExtensionFieldUI, index: number): LookupExtensionFieldApi => ({
  seqNumber: index + 1,
  fieldName: uiField.displayName,
  element: uiField.element,
  dataType: uiField.dataType,
  lookupCode: uiField.lookupCode || null,
  required: uiField.required || false
});

/**
 * Maps UI entry to API format
 */
const mapUiEntryToApiEntry = (uiEntry: LookupExtensionEntryUI): LookupExtensionEntryApi => ({
  lookupValue: uiEntry.lookupValue,
  ...uiEntry.values
});

/**
 * Maps UI lookup extension to API create request
 */
export const mapUiToCreateRequest = (uiData: LookupExtensionUI, createdBy: string): LookupExtensionCreateRequest => {
  const now = new Date().toISOString();
  return {
    extensionCode: uiData.extensionId,
    name: uiData.displayName,
    field: uiData.lookupCode,
    jsonData: {
      fields: uiData.fields.map(mapUiFieldToApiField),
      entries: uiData.entries.map(mapUiEntryToApiEntry)
    },
    systemSw: uiData.systemDefined ? 'Y' : 'N',
    userMappingSw: uiData.userMapping ? 'Y' : 'N',
    multipleOccurrencesSw: uiData.multipleOccurrences ? 'Y' : 'N',
    createdBy,
    createdDate: now,
    modifiedBy: createdBy,
    modifiedDate: now,
    version: 0
  };
};

/**
 * Maps UI lookup extension to API update request
 */
export const mapUiToUpdateRequest = (uiData: LookupExtensionUI, modifiedBy: string): LookupExtensionUpdateRequest => {
  const now = new Date().toISOString();
  return {
    extensionCode: uiData.extensionId,
    name: uiData.displayName,
    field: uiData.lookupCode,
    jsonData: {
      fields: uiData.fields.map(mapUiFieldToApiField),
      entries: uiData.entries.map(mapUiEntryToApiEntry)
    },
    systemSw: uiData.systemDefined ? 'Y' : 'N',
    userMappingSw: uiData.userMapping ? 'Y' : 'N',
    multipleOccurrencesSw: uiData.multipleOccurrences ? 'Y' : 'N',
    createdBy: uiData.createdBy || modifiedBy,
    createdDate: uiData.createdDate || now,
    modifiedBy,
    modifiedDate: now,
    version: (uiData.version || 0) + 1
  };
};

// ========================================
// AXIOS INSTANCE CONFIGURATION
// ========================================

/** Axios instance with default configuration */
const lookupExtensionApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
  withCredentials: false
});

// Add request interceptor for debugging
if (lookupExtensionApiClient?.interceptors) {
  lookupExtensionApiClient.interceptors.request.use(
    (config) => {
      console.log(`[Lookup Extension API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      });
      return config;
    },
    async (error) => {
      console.error('[Lookup Extension API] Request Error:', error);
      return Promise.reject(error instanceof Error ? error : new Error('Request failed'));
    }
  );

  // Add response interceptor for debugging
  lookupExtensionApiClient.interceptors.response.use(
    (response) => {
      console.log(`[Lookup Extension API] Response:`, response.data);
      return response;
    },
    async (error) => {
      const errorData = axios.isAxiosError(error) ? error.response?.data : null;
      const errorMessage = axios.isAxiosError(error) ? error.message : 'Unknown error';
      console.error('[Lookup Extension API] Response Error:', errorData || errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
  );
}

// ========================================
// ERROR HANDLER
// ========================================

/**
 * Formats axios error to API error
 */
const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error;
    const responseData = axiosError.response?.data as {message?: string} | undefined;
    const errorMessage = responseData?.message || axiosError.message || 'An error occurred';
    return {
      message: errorMessage,
      status: axiosError.response?.status,
      details: axiosError.response?.data
    };
  }
  const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
  return {
    message: errorMessage
  };
};

// ========================================
// API SERVICE FUNCTIONS
// ========================================

/**
 * Search/Filter Lookup Extensions
 * GET /admin/v1/extensionLookup
 */
export async function searchLookupExtensions(
  params: LookupExtensionSearchParams = {}
): Promise<LookupExtensionSearchResponse> {
  try {
    const response = await lookupExtensionApiClient.get<LookupExtensionSearchResponse>('/admin/v1/extensionLookup', {
      params
    });
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

/**
 * Get Lookup Extension by Code
 * GET /admin/v1/extensionLookup/{extensionCode}
 */
export async function getLookupExtensionByCode(extensionCode: string): Promise<LookupExtensionResponse> {
  try {
    const response = await lookupExtensionApiClient.get<LookupExtensionResponse>(
      `/admin/v1/extensionLookup/${extensionCode}`
    );
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

/**
 * Get Lookup Extension by Code and Field
 * GET /admin/v1/extensionLookup/{extensionCode}/{field}
 */
export async function getLookupExtensionByCodeAndField(
  extensionCode: string,
  field: string
): Promise<LookupExtensionResponse> {
  try {
    const response = await lookupExtensionApiClient.get<LookupExtensionResponse>(
      `/admin/v1/extensionLookup/${extensionCode}/${field}`
    );
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

/**
 * Create Lookup Extension
 * POST /admin/v1/extensionLookup
 */
export async function createLookupExtension(data: LookupExtensionCreateRequest): Promise<LookupExtensionResponse> {
  try {
    const response = await lookupExtensionApiClient.post<LookupExtensionResponse>('/admin/v1/extensionLookup', data);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

/**
 * Update Lookup Extension
 * PUT /admin/v1/extensionLookup
 */
export async function updateLookupExtension(data: LookupExtensionUpdateRequest): Promise<LookupExtensionResponse> {
  try {
    const response = await lookupExtensionApiClient.put<LookupExtensionResponse>('/admin/v1/extensionLookup', data);
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

/**
 * Delete Lookup Extension
 * DELETE /admin/v1/extensionLookup/{extensionCode}/{field}
 */
export async function deleteLookupExtension(
  extensionCode: string,
  field: string
): Promise<LookupExtensionDeleteResponse> {
  try {
    const response = await lookupExtensionApiClient.delete<LookupExtensionDeleteResponse>(
      `/admin/v1/extensionLookup/${extensionCode}/${field}`
    );
    return response.data;
  } catch (error) {
    const apiError = handleApiError(error);
    throw new Error(apiError.message);
  }
}

// Export all functions as default object
export default {
  searchLookupExtensions,
  getLookupExtensionByCode,
  getLookupExtensionByCodeAndField,
  createLookupExtension,
  updateLookupExtension,
  deleteLookupExtension,
  mapApiToUi,
  mapUiToCreateRequest,
  mapUiToUpdateRequest
};
