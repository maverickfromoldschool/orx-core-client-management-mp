'use client';

import {useState, useCallback} from 'react';
import axios from 'axios';

const API_BASE_URL = process.env['REACT_APP_API_BASE_URL'] || 'https://coreweb-dev-api.optum.com';

/**
 * Lookup Extension API response structure
 */
export interface LookupExtensionFieldApi {
  seqNumber: number;
  fieldName: string;
  element: string;
  dataType: string;
  lookupCode: string | null;
  required: boolean;
}

export interface LookupExtensionEntryApi {
  lookupValue: string;
  [key: string]: any;
}

export interface LookupExtensionApi {
  extensionCode: string;
  field: string;
  name: string;
  jsonData: {
    fields: LookupExtensionFieldApi[];
    entries: LookupExtensionEntryApi[];
  };
  systemSw: string;
  userMappingSw: string;
  multipleOccurrencesSw: string;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

export interface LookupExtensionSearchResponse {
  success: boolean;
  data: {
    totalPages: number;
    currentPage: number;
    totalRecord: number;
    data: LookupExtensionApi[];
  };
  message: string;
}

export interface LookupExtensionResponse {
  success: boolean;
  data: LookupExtensionApi;
  message: string;
}

export interface LookupExtensionDeleteResponse {
  success: boolean;
  message: string;
}

export interface UseLookupExtensionApiReturn {
  searchLookupExtensions: (params: {
    page: number;
    size: number;
    name?: string;
    extensionCode?: string;
    field?: string;
    systemDefined?: string;
  }) => Promise<LookupExtensionSearchResponse>;
  createLookupExtension: (data: LookupExtensionApi) => Promise<LookupExtensionResponse>;
  updateLookupExtension: (data: LookupExtensionApi) => Promise<LookupExtensionResponse>;
  deleteLookupExtension: (extensionCode: string, field: string) => Promise<LookupExtensionDeleteResponse>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for Lookup Extension API interactions
 */
export function useLookupExtensionApi(): UseLookupExtensionApiReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLookupExtensions = useCallback(
    async (params: {
      page: number;
      size: number;
      name?: string;
      extensionCode?: string;
      field?: string;
      systemDefined?: string;
    }): Promise<LookupExtensionSearchResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // Build query params, excluding undefined values
        const queryParams: Record<string, string | number> = {
          page: params.page,
          size: params.size
        };

        if (params.name) queryParams['name'] = params.name;
        if (params.extensionCode) queryParams['extensionCode'] = params.extensionCode;
        if (params.field) queryParams['field'] = params.field;
        if (params.systemDefined) queryParams['systemDefined'] = params.systemDefined;

        // eslint-disable-next-line no-console
        console.log('[Lookup Extension API] GET /admin/v1/extensionLookup', {params: queryParams});
        // eslint-disable-next-line no-console
        console.log('[Lookup Extension API] Field parameter:', params.field);

        const response = await axios.get<LookupExtensionSearchResponse>(`${API_BASE_URL}/admin/v1/extensionLookup`, {
          params: queryParams
        });

        // eslint-disable-next-line no-console
        console.log('[Lookup Extension API] Response:', response.data);

        return response.data;
      } catch (err: unknown) {
        let errorMessage = 'Failed to search lookup extensions';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('[Lookup Extension API] Error:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const createLookupExtension = useCallback(async (data: LookupExtensionApi): Promise<LookupExtensionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line no-console
      console.log('[Lookup Extension API] POST /admin/v1/extensionLookup', {data});

      const response = await axios.post<LookupExtensionResponse>(`${API_BASE_URL}/admin/v1/extensionLookup`, data);

      // eslint-disable-next-line no-console
      console.log('[Lookup Extension API] Response:', response.data);

      return response.data;
    } catch (err: unknown) {
      let errorMessage = 'Failed to create lookup extension';
      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data as {message?: string} | undefined;
        errorMessage = apiError?.message ?? err.message;
      }
      setError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('[Lookup Extension API] Error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateLookupExtension = useCallback(async (data: LookupExtensionApi): Promise<LookupExtensionResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // eslint-disable-next-line no-console
      console.log('[Lookup Extension API] PUT /admin/v1/extensionLookup', {data});

      const response = await axios.put<LookupExtensionResponse>(`${API_BASE_URL}/admin/v1/extensionLookup`, data);

      // eslint-disable-next-line no-console
      console.log('[Lookup Extension API] Response:', response.data);

      return response.data;
    } catch (err: unknown) {
      let errorMessage = 'Failed to update lookup extension';
      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data as {message?: string} | undefined;
        errorMessage = apiError?.message ?? err.message;
      }
      setError(errorMessage);
      // eslint-disable-next-line no-console
      console.error('[Lookup Extension API] Error:', err);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteLookupExtension = useCallback(
    async (extensionCode: string, field: string): Promise<LookupExtensionDeleteResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // eslint-disable-next-line no-console
        console.log('[Lookup Extension API] DELETE /admin/v1/extensionLookup', {extensionCode, field});

        const response = await axios.delete<LookupExtensionDeleteResponse>(
          `${API_BASE_URL}/admin/v1/extensionLookup/${extensionCode}/${field}`
        );

        // eslint-disable-next-line no-console
        console.log('[Lookup Extension API] Response:', response.data);

        return response.data;
      } catch (err: unknown) {
        let errorMessage = 'Failed to delete lookup extension';
        if (axios.isAxiosError(err)) {
          const apiError = err.response?.data as {message?: string} | undefined;
          errorMessage = apiError?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('[Lookup Extension API] Error:', err);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    searchLookupExtensions,
    createLookupExtension,
    updateLookupExtension,
    deleteLookupExtension,
    isLoading,
    error
  };
}
