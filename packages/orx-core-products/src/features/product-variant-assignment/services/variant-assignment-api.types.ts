/**
 * API Types for Product Variant Assignment
 *
 * Type definitions for API requests and responses
 */

/**
 * Variant value from API response
 */
export interface VariantValueApiResponse {
  value: string;
  description: string;
}

/**
 * Product variant from API response (matching actual API structure)
 */
export interface ProductVariantApiResponse {
  createdBy: string | null;
  modifiedBy: string | null;
  createdDate: string;
  modifiedDate: string;
  version: number;
  productVariantId: string;
  variant: string; // This is the variantField
  variantName: string | null;
  fieldType: string | null;
  predefinedField: string | null;
  dataType: string | null;
  productId: string;
  priorityOrder: number;
  priceDetermination: 'Y' | 'N'; // String, not boolean
  transactionProcessing: 'Y' | 'N'; // String, not boolean
  variantValue: string; // This is the defaultValue
  predefinedSw: string | null;
  notes: string | null;
  entity: string | null;
  attribute: string | null;
  startDate: string | null;
  endDate: string | null;
  productCode: string | null;
  productGroup: string | null;
  variantValues: VariantValueApiResponse[] | null;
}

/**
 * Product variant list API response wrapper
 */
export interface ProductVariantListApiResponse {
  success: boolean;
  message: ProductVariantApiResponse[];
  data: string;
}

/**
 * Product API response wrapper (for getProductById - kept for reference)
 */
export interface ProductApiResponse {
  success: boolean;
  message: {
    product: {
      productId: string;
      productName: string;
      status: string;
      productCode: string;
      // ... other product fields
    };
    productVariants: ProductVariantApiResponse[];
    productAttributes: any[];
    priceListEntryPresent: any;
  };
  data: string;
}

/**
 * Variant assignment from API response (kept for backward compatibility)
 */
export interface VariantAssignmentApiResponse {
  id: string;
  variantField: string;
  defaultValue?: string;
  dataType?: string;
  priorityOrder: number;
  transactionProcessing: boolean;
  priceDetermination: boolean;
  startDate: string | null;
  endDate: string | null;
  variantValues: VariantValueApiResponse[];
  createdBy?: string;
  createdDate?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
}

/**
 * Paginated response for variant assignments list
 */
export interface VariantAssignmentsApiResponse {
  data: VariantAssignmentApiResponse[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

/**
 * Request body for creating variant assignment
 */
export interface CreateVariantAssignmentRequest {
  variant: string;
  variantValue: string;
  dataType: string;
  priorityOrder: number;
  startDate: string | null;
  endDate: string | null;
  priceDetermination: 'Y' | 'N';
  transactionProcessing: 'Y' | 'N';
  productId: string;
}

/**
 * Request body for updating variant assignment
 */
export interface UpdateVariantAssignmentRequest {
  variant: string;
  variantValue: string;
  dataType: string;
  priorityOrder: number;
  startDate: string | null;
  endDate: string | null;
  priceDetermination: 'Y' | 'N';
  transactionProcessing: 'Y' | 'N';
  productId: string;
  productVariantId: string;
}

/**
 * Parameters for fetching variant assignments
 */
export interface GetVariantAssignmentsParams {
  productId: string;
  page?: number; // 0-based page number
  size?: number; // Page size
  variantField?: string;
  dataType?: string;
  transactionProcessing?: boolean;
  priceDetermination?: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Variant option for dropdown
 */
export interface VariantOption {
  variant: string; // Display identifier for form (will be variantCode)
  variantCode: string; // The code from API (e.g., "BALREQ")
  variantName: string; // The name from API (e.g., "Balance Requirement")
  dataType: string;
  variantValues?: {
    variant: string;
    variantValue: string;
    description: string;
  }[];
}

/**
 * Variants API response from /variant endpoint
 */
export interface VariantsListApiResponse {
  success: boolean;
  data: {
    data: {
      variant: string;
      name: string;
      dataType: string;
      systemDefinedLookup: string;
      predefinedSw: string;
      entity: string;
      notes: string;
      variantValues?: {
        variant: string;
        variantValue: string;
        description: string;
      }[];
    }[];
    totalRecord: number;
  };
}

/**
 * Bulk delete request
 */
export interface BulkDeleteRequest {
  ids: string[];
}

/**
 * Bulk delete response
 */
export interface BulkDeleteResponse {
  successCount: number;
  failedIds: string[];
  errors?: {
    id: string;
    message: string;
  }[];
}

/**
 * API Error response
 */
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}
