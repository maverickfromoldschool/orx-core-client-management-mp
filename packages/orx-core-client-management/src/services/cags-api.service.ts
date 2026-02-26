/* eslint-disable no-console */
import axios, {AxiosError} from 'axios';

import type {ApiError} from '../types';

const API_BASE_URL = 'https://coreweb-dev-api.optum.com/api';

// ========================================
// TYPE DEFINITIONS
// ========================================

// Add your type definitions here
interface CAG {
  id: string;
  name: string;
  clientId: string;
  contractId: string;
  operationalUnitId: string;
  // Add other CAG properties as needed
}

interface CAGCreateRequest {
  name: string;
  clientId: string;
  contractId: string;
  operationalUnitId: string;
  // Add other required fields
}

interface Client {
  clientId: string;
  clientName: string;
  clientReferenceId: string;
  // Add other Client properties as needed
}

interface CAGUpdateRequest extends CAGCreateRequest {
  id: string;
}

// ========================================
// AXIOS INSTANCE CONFIGURATION
// ========================================

// Axios instance with default configuration
const cagApiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  },
  withCredentials: false // Enable CORS
});

// Add request interceptor for debugging (only if instance was created successfully)
if (cagApiClient?.interceptors) {
  cagApiClient.interceptors.request.use(
    (config) => {
      // eslint-disable-next-line no-console
      console.log('CAG API Request:', config.method?.toUpperCase(), config.url);
      return config;
    },
    async (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for debugging
  cagApiClient.interceptors.response.use(
    (response) => {
      // eslint-disable-next-line no-console
      console.log('CAG API Response:', response.status, response.config.url);
      return response;
    },
    async (error: AxiosError) => {
      // eslint-disable-next-line no-console
      console.error('CAG API Error:', error.message, error.config?.url);
      return Promise.reject(error);
    }
  );
}

// ========================================
// ERROR HANDLER UTILITY
// ========================================

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

// ========================================
// API SERVICE METHODS
// ========================================

export const cagsApiService = {
  // ========================================
  // GET METHODS - Retrieve Data
  // ========================================

  /**
   * Get all CAGs with pagination
   * @param page - Page number (default: 0)
   * @param size - Page size (default: 10)
   * @param params - Optional search query
   * @returns Paged response with CAGs
   */
  getCAGsPaged: async ({page = 0, size = 10, params = {}}): Promise<any> => {
    try {
      const response = await cagApiClient.get('/cag/getUnassignedCagList', {
        params: {page, size, ...params}
      });
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      return response.data as any;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get a single CAG by ID
   * @param cagId - The CAG ID
   * @returns CAG object or null
   */
  getCAGById: async (cagId: string): Promise<CAG | null> => {
    try {
      const response = await cagApiClient.get(`/cags/${cagId}`);

      if (response.status !== 200) {
        console.error('Failed to fetch CAG data', response);
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get active client list
   * @returns Array of Clients
   */
  getClients: async (): Promise<Client[]> => {
    try {
      // Use direct axios call to match the working component implementation
      const response = await cagApiClient.get('/clients/activeClientList');
      // eslint-disable-next-line no-console
      console.log('getClients response:', response.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
      return response?.data?.clientList ?? [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('getClients error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get contracts by Client ID
   * @param clientId - The Client ID
   * @returns Array of contracts
   */
  getContractsByClientId: async (clientId: string): Promise<unknown[]> => {
    try {
      // Use cagApiClient for consistent API calls
      const response = await cagApiClient.get<{contractList?: unknown[]}>('/clients/contractList', {
        params: {clientId}
      });
      // eslint-disable-next-line no-console
      console.log('getContractsByClientId response:', response.data);
      return response.data?.contractList ?? [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('getContractsByClientId error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get operational units by Client ID and Contract ID
   * @param contractInternalId - The Contract ID
   * @returns Array of operational units
   */
  getOperationalUnitsByClientAndContract: async (contractInternalId: string): Promise<any[]> => {
    try {
      // Use cagApiClient for consistent API calls
      const response = await cagApiClient.get<{operationUnitList?: any[]}>('/clients/activeOperationUnitList', {
        params: {contractInternalId}
      });
      // eslint-disable-next-line no-console
      console.log('getOperationalUnitsByClientAndContract response:', response.data);
      // Response is wrapped in operationUnitList (note: operation not operational)
      return response.data?.operationUnitList ?? [];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('getOperationalUnitsByClientAndContract error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Get assigned CAG list by operational unit
   * @param operationUnitInternalId - The operational unit internal ID
   * @param page - Page number (default: 0)
   * @param size - Page size (default: 10)
   * @param carrierName - Filter by carrier name
   * @param carrierId - Filter by carrier ID
   * @param accountName - Filter by account name
   * @param accountId - Filter by account ID
   * @param groupName - Filter by group name
   * @param groupId - Filter by group ID
   * @param assignmentStatus - Filter by assignment status
   * @param startDate - Filter by start date
   * @param endDate - Filter by end date
   * @returns Paged response with assigned CAGs
   */
  getAssignedCagList: async ({
    operationUnitInternalId,
    page = 0,
    size = 10,
    carrierName,
    carrierId,
    accountName,
    accountId,
    groupName,
    groupId,
    assignmentStatus,
    startDate,
    endDate
  }: {
    operationUnitInternalId: string;
    page?: number;
    size?: number;
    carrierName?: string;
    carrierId?: string;
    accountName?: string;
    accountId?: string;
    groupName?: string;
    groupId?: string;
    assignmentStatus?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> => {
    try {
      // Build params object, only including defined values
      const params: Record<string, string | number> = {
        operationUnitInternalId,
        page,
        size,
        ...(carrierName && {carrierName}),
        ...(carrierId && {carrierId}),
        ...(accountName && {accountName}),
        ...(accountId && {accountId}),
        ...(groupName && {groupName}),
        ...(groupId && {groupId}),
        ...(assignmentStatus && {assignmentStatus}),
        ...(startDate && {startDate}),
        ...(endDate && {endDate})
      };

      // Use cagApiClient for consistent API calls
      const response = await cagApiClient.get('/cag/assignedCAGList', {
        params
      });
      // eslint-disable-next-line no-console
      console.log('getAssignedCagList response:', response.data);
      return response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('getAssignedCagList error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Update CAG status (activate/deactivate)
   * @param ouCagIds - Array of OU CAG IDs to update
   * @param status - New status ('ACTIVE' or 'INACTIVE')
   * @returns Response from the API
   */
  updateCAGStatus: async ({ouCagIds, status}: {ouCagIds: string[]; status: 'ACTIVE' | 'INACTIVE'}): Promise<any> => {
    try {
      // Use cagApiClient for consistent API calls
      const response = await cagApiClient.put(
        '/cag/updateStatus',
        {
          ouCagIds,
          status
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      // eslint-disable-next-line no-console
      console.log('updateCAGStatus response:', response);
      // 204 No Content is a successful response with no body
      return response.status === 204 ? {success: true} : response.data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('updateCAGStatus error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  // ========================================
  // POST METHODS - Create Data
  // ========================================

  /**
   * Create a new CAG
   * @param data - CAG creation data
   * @returns Created CAG object
   */
  createCAG: async (data: CAGCreateRequest): Promise<CAG> => {
    try {
      const response = await cagApiClient.post('/cags', data);
      return response.data as CAG;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Assign CAGs to a client
   * @param data - Assignment data containing CAG IDs and assignment level
   * @returns Assignment response
   */
  assignCAGs: async (data: {
    operationUnitInternalId: string;
    cagIds: string[];
    assignmentType: string;
    startDate: string;
    endDate?: string;
  }): Promise<any> => {
    try {
      console.log('Calling assign API with data:', data);
      console.log('Request URL:', '/cag/assign');

      const response = await cagApiClient.post('/cag/assign', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Assign API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Assign API error:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error response:', error?.response?.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error status:', error?.response?.status);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error headers:', error?.response?.headers);
      return handleApiError(error as AxiosError);
    }
  },

  /**
   * Edit assigned CAG end date
   * @param data - Edit data containing operational unit ID, OU CAG ID, and end date
   * @returns Edit response
   */
  editAssignedCAG: async (data: {
    operationUnitInternalId: string;
    ouCagAssignmentId: string;
    endDate: string;
  }): Promise<any> => {
    try {
      console.log('Calling editCAG API with data:', data);
      console.log('Request URL:', '/cag/editAssignedCAG');

      const response = await cagApiClient.post('/cag/editAssignedCAG', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Edit CAG API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Edit CAG API error:', error);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error response:', error?.response?.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error status:', error?.response?.status);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.error('Error headers:', error?.response?.headers);
      return handleApiError(error as AxiosError);
    }
  },

  // ========================================
  // PUT/PATCH METHODS - Update Data
  // ========================================

  /**
   * Update an existing CAG
   * @param cagId - The CAG ID to update
   * @param data - Updated CAG data
   * @returns Updated CAG object
   */
  updateCAG: async (cagId: string, data: CAGUpdateRequest): Promise<CAG> => {
    try {
      const response = await cagApiClient.put(`/cags/${cagId}`, data);
      return response.data as CAG;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // ========================================
  // DELETE METHODS - Remove Data
  // ========================================

  /**
   * Delete a CAG by ID
   * @param cagId - The CAG ID to delete
   * @returns Success response
   */
  deleteCAG: async (ouCagIds: string[]): Promise<{success: boolean; message: string}> => {
    try {
      const response = await cagApiClient.put(
        '/cag/deleteCag',
        {
          ouCagIds
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data as {success: boolean; message: string};
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }

  // ========================================
  // TEMPLATE FOR ADDING NEW API METHODS
  // ========================================
  /*
  
  // EXAMPLE GET METHOD:
  getExampleData: async (id: string): Promise<ExampleType> => {
    try {
      const response = await cagApiClient.get(`/endpoint/${id}`);
      return response.data as ExampleType;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // EXAMPLE POST METHOD:
  createExampleData: async (data: ExampleRequest): Promise<ExampleResponse> => {
    try {
      const response = await cagApiClient.post('/endpoint', data);
      return response.data as ExampleResponse;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // EXAMPLE PUT METHOD:
  updateExampleData: async (id: string, data: ExampleRequest): Promise<ExampleResponse> => {
    try {
      const response = await cagApiClient.put(`/endpoint/${id}`, data);
      return response.data as ExampleResponse;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // EXAMPLE DELETE METHOD:
  deleteExampleData: async (id: string): Promise<void> => {
    try {
      await cagApiClient.delete(`/endpoint/${id}`);
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },

  // EXAMPLE METHOD WITH QUERY PARAMETERS:
  searchExampleData: async (params: {query: string; filter?: string}): Promise<ExampleType[]> => {
    try {
      const response = await cagApiClient.get('/endpoint/search', {
        params
      });
      return response.data as ExampleType[];
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  }

  */
};

export default cagsApiService;
