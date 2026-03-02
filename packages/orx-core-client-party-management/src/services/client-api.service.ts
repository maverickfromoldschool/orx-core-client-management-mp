/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import {AxiosError} from 'axios';
import {apiClient} from '@optum-rx-core/orx-core-axios';

import type {ApiError} from '../types';
import type {AddClientCombinedFormData} from '../stepper/schemas';
import {toAPIDraftSchema} from '../libs/mapper';
import {toPartySchema, fromPartySchema} from '../libs/party-mapper';
import type {CreateClientPartyData} from '../schema/party';
import {GetAllPartyResponse} from '../schema/get-all-party';
import {GetPartyResponse} from '../schema/get-party';

// Type for draft save response
interface DraftResponse {
  id: string;
  draftId?: string;
}

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
      console.log({data});
      const clientParty: CreateClientPartyData = toPartySchema(data);

      let response;

      if (mode === 'save') {
        response = await apiClient.post('/party/organization/allEntity', clientParty);
      } else {
        response = await apiClient.put('/party/organization/allEntity', clientParty);
      }

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
      const response = await apiClient.get<GetPartyResponse>(`/party/organization/${clientId}`);

      if (response.status !== 200) {
        console.error('Failed to fetch client data', response);
        return null;
      }

      // Map API response to form data using the reverse mapper
      return fromPartySchema(response.data);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  getClientsPaged: async ({
    page = 0,
    size = 10,
    sort = 'modifiedAt,desc',
    searchQuery = ''
  }): Promise<GetAllPartyResponse> => {
    try {
      const response = await apiClient.get<GetAllPartyResponse>('/party/organization/all', {
        params: {page, size, sort, searchQuery}
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }
};

export default clientApiService;
