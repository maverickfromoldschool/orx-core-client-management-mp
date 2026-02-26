import axios, {AxiosInstance} from 'axios';

import type {
  PriceListDetailsApi,
  PriceListEntrySummary,
  PriceListEntry,
  PriceListEntryDetailsApi,
  PriceListsApiResponse
} from './price-list-api.types';

/**
 * Price List API Service
 * Handles all API calls related to price lists
 */
class PriceListApiService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL = 'https://coreweb-dev-api.optum.com/api/v1') {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Get price list details by ID
   * @param priceListId - The ID of the price list
   * @returns Promise with price list details
   */
  async getPriceListById(priceListId: string): Promise<PriceListDetailsApi> {
    try {
      const response = await this.axiosInstance.get<PriceListDetailsApi>(`/pricelists/${priceListId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = new Error(
          (error.response?.data as {message?: string})?.message || error.message || 'Failed to fetch price list'
        );
        Object.assign(apiError, {
          code: error.response?.status?.toString() || 'UNKNOWN',
          details: error.response?.data
        });
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Get all price lists with pagination and filters
   * @param params - Query parameters for pagination and filtering
   * @returns Promise with paginated price lists
   */
  async getPriceLists(params: {
    page: number;
    size: number;
    priceListCode?: string;
    priceListName?: string;
    businessSector?: string;
    priceListType?: string;
    effectiveDate?: string;
    status?: string;
  }): Promise<PriceListsApiResponse> {
    try {
      const response = await this.axiosInstance.get<PriceListsApiResponse>('/pricelists', {params});
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = new Error(
          (error.response?.data as {message?: string})?.message || error.message || 'Failed to fetch price lists'
        );
        Object.assign(apiError, {
          code: error.response?.status?.toString() || 'UNKNOWN',
          details: error.response?.data
        });
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Get price list entries for a specific price list
   * @param priceListId - The ID of the price list
   * @returns Promise with array of price list entries
   */
  async getPriceListEntries(priceListId: string): Promise<PriceListEntrySummary[]> {
    try {
      const response = await this.axiosInstance.get<PriceListEntrySummary[]>(`/pricelists/${priceListId}/entries`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = new Error(
          (error.response?.data as {message?: string})?.message || error.message || 'Failed to fetch price list entries'
        );
        Object.assign(apiError, {
          code: error.response?.status?.toString() || 'UNKNOWN',
          details: error.response?.data
        });
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Get price list entry details by entry ID
   * @param entryId - The ID of the price list entry
   * @returns Promise with price list entry details
   */
  async getPriceListEntryById(entryId: string): Promise<PriceListEntry> {
    try {
      const response = await this.axiosInstance.get<PriceListEntryDetailsApi>(`/pricelist-entries/${entryId}`);
      // Transform API response to internal format
      const {priceListEntry, priceRules} = response.data;
      return {
        entryId,
        ...priceListEntry,
        priceRules
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = new Error(
          (error.response?.data as {message?: string})?.message || error.message || 'Failed to fetch price list entry'
        );
        Object.assign(apiError, {
          code: error.response?.status?.toString() || 'UNKNOWN',
          details: error.response?.data
        });
        throw apiError;
      }
      throw error;
    }
  }

  /**
   * Set custom base URL for the API
   * @param baseURL - The base URL to use
   */
  setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  /**
   * Set authorization token
   * @param token - The authorization token
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
}

// Export singleton instance
export const priceListApiService = new PriceListApiService();
