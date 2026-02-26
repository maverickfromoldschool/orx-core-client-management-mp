/* eslint-disable no-console */
import axios, {AxiosError} from 'axios';

import type {ApiError} from '../types';
import type {AddClientCombinedFormData} from '../stepper/schemas';
import {toAPIClientSchema, toUIFormSchema, toAPIDraftSchema} from '../libs/mapper';
import type {Client as APICLient, ClientUpdateType} from '../libs/api-client-types';

const API_BASE_URL = 'https://coreweb-dev-api.optum.com/api';

// Type for draft save response
interface DraftResponse {
  id: string;
  draftId?: string;
}

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  }
});

// Error handler utility
const handleApiError = (error: AxiosError): never => {
  const apiError: ApiError = {
    message: error.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN_ERROR',
    details: error.response?.data as Record<string, unknown>
  };
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw apiError;
};

export const clientApiService = {
  // ADD CLIENT DRAFT API METHODS (Postman Collection)

  saveDraft: async (data: AddClientCombinedFormData, currentStep: number, draftId?: string): Promise<DraftResponse> => {
    try {
      // Use partial mapper to send only current step's data
      const apiData = toAPIDraftSchema(data, currentStep, draftId);

      const response = await apiClient.post('/clients/draft', apiData);
      return response.data as DraftResponse;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  submitClient: async (
    data: AddClientCombinedFormData,
    mode: 'save' | 'update' = 'save',
    clientId?: string,
    draftId?: string
  ): Promise<any> => {
    try {
      let apiData = toAPIClientSchema(data);
      if (mode === 'update') {
        apiData = {...apiData, clientId, draftId} as ClientUpdateType;
      }
      console.log('submitClient >> ', {mode}, {apiData});

      const response = await apiClient.post('/clients/submit', apiData);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  getDraftByClientReferenceId: async (clientReferenceId: string, page = 0, size = 10): Promise<any> => {
    try {
      const response = await apiClient.get(`/clients/drafts/${clientReferenceId}`, {
        params: {page, size}
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  getDraftById: async (draftId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/clients/${draftId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  getClientByClientId: async (clientId: string): Promise<AddClientCombinedFormData | null> => {
    try {
      const response = await apiClient.get(`/clients/client/${clientId}`);

      if (response.status !== 200) {
        console.error('Failed to fetch client data', response);
        return null;
      }

      return toUIFormSchema(response.data as APICLient);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  getClientsPaged: async ({page = 0, size = 10, sort = 'modifiedAt,desc', searchQuery = ''}): Promise<any> => {
    try {
      const response = await apiClient.get('/clients/paged', {
        params: {page, size, sort, searchQuery}
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
};

export default clientApiService;
