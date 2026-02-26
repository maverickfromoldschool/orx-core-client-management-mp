/**
 * API endpoint configuration for the Accounting Code component
 */
export interface ApiEndpoints {
  /**
   * Endpoint to fetch accounting codes list
   * @example '/api/accounting-codes'
   */
  getAccountingCodes: string;

  /**
   * Endpoint to create a new accounting code
   * @example '/api/accounting-codes'
   */
  createAccountingCode: string;

  /**
   * Endpoint to update an accounting code
   * @example '/api/accounting-codes/:id'
   */
  updateAccountingCode: string;

  /**
   * Endpoint to delete an accounting code
   * @example '/api/accounting-codes/:id'
   */
  deleteAccountingCode: string;

  /**
   * Endpoint to fetch GL account types
   * @example '/api/gl-account-types'
   */
  getGlAccountTypes?: string;

  /**
   * Endpoint to fetch GL account groups
   * @example '/api/gl-account-groups'
   */
  getGlAccountGroups?: string;

  /**
   * Endpoint to fetch GL accounting key plugins
   * @example '/api/gl-accounting-key-plugins'
   */
  getGlAccountingKeyPlugins?: string;

  /**
   * Endpoint to create a new accounting code (v1)
   * @example '/v1/accounting-code'
   */
  createAccountingCodeV1: string;

  /**
   * Endpoint to update an existing accounting code (v1)
   * @example '/v1/accounting-code/:accountingCode'
   */
  updateAccountingCodeV1: string;

  /**
   * Endpoint to get accounting codes list with pagination (v1)
   * @example '/v1/accounting-code'
   */
  getAccountingCodesListV1: string;

  /**
   * Endpoint to get a single accounting code (v1)
   * @example '/v1/accounting-code/:accountingCode'
   */
  getAccountingCodeV1: string;
}

/**
 * API configuration including endpoints and optional axios config
 */
export interface ApiConfig {
  /**
   * API endpoints configuration
   */
  endpoints: ApiEndpoints;

  /**
   * Optional headers to include in all requests
   */
  headers?: Record<string, string>;

  /**
   * Optional timeout in milliseconds
   */
  timeout?: number;
}

/**
 * Query parameters for fetching accounting codes
 */
export interface GetAccountingCodesParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
