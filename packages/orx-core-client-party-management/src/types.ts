/**
 * Client data types for the Client List Page
 * Requirements: 3.1, 3.5
 */

/** Client status values */
export type ClientStatus = 'Complete' | 'Draft' | 'Pending' | 'Inactive';

/** Client record interface */
export interface Client {
  /** Unique identifier for the client */
  // id: string;
  clientId: string;
  draftId: string;
  /** Display name of the client */
  clientName: string;

  /** Current status of the client */
  status: ClientStatus;
  /** Reference ID for the client */
  clientReferenceId: string;
  /** Effective date of the client contract (ISO date string) */
  effectiveDate: string;
  /** Number of operational units */
  operationalUnitsCount: number;

  // draftId?: string;
}

/** Pagination state interface */
export interface PaginationState {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of items */
  totalItems: number;
  /** Total number of pages */
  totalPages: number;
}

/** Filter state interface */
export interface FilterState {
  /** Search query string */
  searchQuery: string;
  /** Optional status filter */
  statusFilter?: ClientStatus[];
  /** Optional date range filter */
  dateRange?: {
    start: string;
    end: string;
  };
}

/** Pagination request parameters for API calls */
export interface PaginationParams {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  size: number;
  /** Optional search query string */
  searchQuery?: string;
  /** Optional status filter */
  statusFilter?: ClientStatus[];
  /** Optional date range filter */
  dateRange?: {
    start: string;
    end: string;
  };
}

/** Paginated client list response from API */
export interface ClientListResponse {
  /** Array of client records */
  clients: Client[];
  /** Pagination metadata */
  pagination: PaginationState;
}

/** Full client details response from API - extends form data with metadata */
export interface ClientDetailsResponse {
  /** Unique identifier for the client */
  id: string;
  /** Current status of the client */
  status: ClientStatus;
  /** Created timestamp (ISO date string) */
  createdAt: string;
  /** Last updated timestamp (ISO date string) */
  updatedAt: string;
  /** User who created the client */
  createdBy?: string;
  /** User who last updated the client */
  updatedBy?: string;

  // Client Details (Step 1)
  clientReferenceId: string;
  clientId?: string;
  clientName: string;
  clientStatus?: string;

  addresses: {
    addressType: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }[];

  // Contract Details (Step 2)
  clientContractId?: string;
  effectiveDate: string;
  terminationDate?: string;
  contractTerm?: string;
  clientMembership?: string;
  clientDoaSignor?: string;
  contractingLegalEntityOptumRx?: string;
  contractingLegalEntityClient?: string;
  assignedTo?: string;
  runOffEffectiveDate?: string;

  // Billing Attributes
  invoiceBreakout: string;
  claimInvoiceFrequency: string;
  feeInvoiceFrequency: string;
  invoiceAggregationLevel: string;
  invoiceType: string;
  invoicingClaimQuantityCounts?: string;
  deliveryOption: string;
  supportDocumentVersion: string;
  claimInvoicePaymentTerm?: string;
  feeInvoicePaymentTerm?: string;
  paymentMethod?: string;

  // Autopay Information
  bankAccountType?: string;
  routingNumber?: string;
  accountNumber?: string;

  // Radio Options
  suppressRejectedClaims: 'yes' | 'no';
  suppressNetZeroClaims: 'yes' | 'no';

  // Contacts & Access (Step 3)
  contacts: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: string;
    accessLevel?: string;
  }[];

  // Operational Units (Step 4)
  operationalUnits: {
    unitName: string;
    unitId: string;
    description?: string;
    effectiveDate: string;
    terminationDate?: string;
    addresses: {
      addressType: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    }[];
  }[];
}

/** API Error response structure */
export interface ApiError {
  /** Error message */
  message: string;
  /** Error code */
  code: string;
  /** Additional error details */
  details?: Record<string, unknown>;
}
