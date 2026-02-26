/**
 * Accounting code list item (without entries for list view)
 */
export interface AccountingCodeListItem {
  /** User who created this record */
  createdBy: string;

  /** User who last modified this record */
  modifiedBy: string;

  /** Creation timestamp */
  createdDate: string | null;

  /** Last modification timestamp */
  modifiedDate: string | null;

  /** Version number for optimistic locking */
  version: number;

  /** Unique accounting code identifier */
  accountingCode: string;

  /** Description of the accounting code */
  description: string;

  /** Additional notes */
  notes: string;

  /** GL account type */
  glAccountType: string;

  /** GL account name */
  glAccountName: string;

  /** GL rule plugin identifier */
  glRulePlugin: string;

  /** Display sequence for ordering */
  displaySequence: number;

  /** GL account number */
  glAccountNumber: string;

  /** GL account type description */
  glAccountTypeDescription: string | null;

  /** GL account group identifier */
  glAccountGroup: string;

  /** Accounting code entries (null in list view) */
  accountingCodeEntries: null;
}

/**
 * Paginated data wrapper
 */
export interface PaginatedData {
  /** Total number of pages */
  totalPages: number;

  /** Current page number (0-indexed) */
  currentPage: number;

  /** Total number of records */
  totalRecord: number;

  /** Array of accounting code list items */
  data: AccountingCodeListItem[];
}

/**
 * Get accounting codes list response
 */
export interface GetAccountingCodesListResponse {
  /** Success indicator */
  success: boolean;

  /** Paginated data */
  data: PaginatedData;

  /** Success message */
  message: string;
}

/**
 * Query parameters for listing accounting codes
 */
export interface GetAccountingCodesListParams {
  /** Page number (0-indexed) */
  page?: number;

  /** Number of items per page */
  size?: number;

  /** Search term for filtering */
  search?: string;

  /** Sort field */
  sortBy?: string;

  /** Sort direction */
  sortOrder?: 'asc' | 'desc';

  accountingCode?: string;
  description?: string;
  glAccountType?: string;
  glAccountName?: string;
  glAccountNumber?: string;
  glAccountGroup?: string;
}

/**
 * Accounting code entry representing a GL account number with effective dates
 */
export interface AccountingCodeEntry {
  /** The accounting code identifier */
  accountingCode: string;

  /** Effective start date in ISO 8601 format */
  effectiveDate: string;

  /** Expiry date in ISO 8601 format (null if no expiry) */
  expiryDate: string | null;

  /** GL account number */
  glAccountNumber: string;

  /** User who created this entry (populated by API) */
  createdBy?: string;

  /** User who last modified this entry (populated by API) */
  modifiedBy?: string;

  /** Creation timestamp (populated by API) */
  createdDate?: string | null;

  /** Last modification timestamp (populated by API) */
  modifiedDate?: string | null;

  /** Version number for optimistic locking (populated by API) */
  version?: number;
}

/**
 * Request payload for creating a new accounting code
 */
export interface CreateAccountingCodeRequest {
  /** Unique accounting code identifier */
  accountingCode: string;

  /** Array of accounting code entries with GL account numbers and dates */
  accountingCodeEntries: AccountingCodeEntry[];

  /** Description of the accounting code */
  description: string;

  /** Additional notes (optional) */
  notes?: string;

  /** GL account type (e.g., "LIST") */
  glAccountType: string;

  /** GL account name */
  glAccountName: string;

  /** GL rule plugin identifier (optional) */
  glRulePlugin?: string;

  /** Display sequence for ordering (string representation of number) */
  displaySequence: string;

  /** GL account number */
  glAccountNumber: string;

  /** GL account type description (optional) */
  glAccountTypeDescription?: string;

  /** GL account group identifier */
  glAccountGroup: string;
}

/**
 * Created accounting code data returned from API
 */
export interface CreatedAccountingCode {
  /** User who created this record */
  createdBy: string;

  /** User who last modified this record */
  modifiedBy: string;

  /** Creation timestamp */
  createdDate: string | null;

  /** Last modification timestamp */
  modifiedDate: string | null;

  /** Version number for optimistic locking */
  version: number;

  /** Unique accounting code identifier */
  accountingCode: string;

  /** Description of the accounting code */
  description: string;

  /** Additional notes */
  notes: string;

  /** GL account type */
  glAccountType: string;

  /** GL account name */
  glAccountName: string;

  /** GL rule plugin identifier */
  glRulePlugin: string;

  /** Display sequence for ordering */
  displaySequence: number;

  /** GL account number */
  glAccountNumber: string;

  /** GL account type description */
  glAccountTypeDescription: string | null;

  /** GL account group identifier */
  glAccountGroup: string;

  /** Array of accounting code entries */
  accountingCodeEntries: AccountingCodeEntry[];
}

/**
 * API response wrapper for successful creation
 */
export interface CreateAccountingCodeResponse {
  /** Success indicator */
  success: boolean;

  /** Created accounting code data */
  data: CreatedAccountingCode;

  /** Success message */
  message: string;
}

/**
 * API response wrapper for retrieving a single accounting code
 */
export interface GetAccountingCodeResponse {
  /** Success indicator */
  success: boolean;

  /** Accounting code data */
  data: CreatedAccountingCode;

  /** Success message */
  message: string;
}

/**
 * Request payload for updating an existing accounting code
 */
export interface UpdateAccountingCodeRequest {
  /** Unique accounting code identifier */
  accountingCode: string;

  /** Array of accounting code entries with GL account numbers and dates */
  accountingCodeEntries: AccountingCodeEntry[];

  /** Description of the accounting code */
  description: string;

  /** Additional notes (optional) */
  notes?: string;

  /** GL account type (e.g., "LIST") */
  glAccountType: string;

  /** GL account name */
  glAccountName: string;

  /** GL rule plugin identifier (optional) */
  glRulePlugin?: string;

  /** Display sequence for ordering (string representation of number) */
  displaySequence: string;

  /** GL account number */
  glAccountNumber: string;

  /** GL account type description (optional) */
  glAccountTypeDescription?: string;

  /** GL account group identifier */
  glAccountGroup: string;
}

/**
 * Updated accounting code data returned from API
 */
export interface UpdatedAccountingCode {
  /** User who created this record */
  createdBy: string;

  /** User who last modified this record */
  modifiedBy: string;

  /** Creation timestamp */
  createdDate: string | null;

  /** Last modification timestamp */
  modifiedDate: string | null;

  /** Version number for optimistic locking */
  version: number;

  /** Unique accounting code identifier */
  accountingCode: string;

  /** Description of the accounting code */
  description: string;

  /** Additional notes */
  notes: string;

  /** GL account type */
  glAccountType: string;

  /** GL account name */
  glAccountName: string;

  /** GL rule plugin identifier */
  glRulePlugin: string;

  /** Display sequence for ordering */
  displaySequence: number;

  /** GL account number */
  glAccountNumber: string;

  /** GL account type description */
  glAccountTypeDescription: string | null;

  /** GL account group identifier */
  glAccountGroup: string;

  /** Array of accounting code entries */
  accountingCodeEntries: AccountingCodeEntry[];
}

/**
 * API response wrapper for successful update
 */
export interface UpdateAccountingCodeResponse {
  /** Success indicator */
  success: boolean;

  /** Updated accounting code data */
  data: UpdatedAccountingCode;

  /** Success message */
  message: string;
}

/**
 * API error response structure
 */
export interface ApiErrorResponse {
  /** Success indicator (false for errors) */
  success: boolean;

  /** Error message */
  message: string;

  /** Error code (optional) */
  errorCode?: string;

  /** Detailed error description (optional) */
  errorCodeDes?: string;
}
