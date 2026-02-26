/**
 * Type definitions for Lookup Extension API
 */

// ========================================
// API REQUEST/RESPONSE TYPES
// ========================================

/**
 * API Field definition (from jsonData.fields)
 */
export interface LookupExtensionFieldApi {
  seqNumber?: number;
  fieldName?: string;
  element: string;
  dataType: string;
  lookupCode?: string | null;
  required?: boolean;
}

/**
 * API Entry definition (from jsonData.entries)
 * Dynamic properties based on fields
 */
export interface LookupExtensionEntryApi {
  lookupValue: string;
  [key: string]: any; // Dynamic properties from fields
}

/**
 * API Request/Response structure for Lookup Extension
 */
export interface LookupExtensionApi {
  extensionCode: string;
  name: string;
  field: string;
  jsonData: {
    fields: LookupExtensionFieldApi[];
    entries: LookupExtensionEntryApi[];
  };
  systemSw: 'Y' | 'N';
  userMappingSw: 'Y' | 'N';
  multipleOccurrencesSw: 'Y' | 'N';
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  version?: number;
}

/**
 * Create Lookup Extension Request
 */
export interface LookupExtensionCreateRequest {
  extensionCode: string;
  name: string;
  field: string;
  jsonData: {
    fields: LookupExtensionFieldApi[];
    entries: LookupExtensionEntryApi[];
  };
  systemSw: 'Y' | 'N';
  userMappingSw: 'Y' | 'N';
  multipleOccurrencesSw: 'Y' | 'N';
  createdBy: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  version: number;
}

/**
 * Update Lookup Extension Request
 * Currently has the same structure as create request
 */
export type LookupExtensionUpdateRequest = LookupExtensionCreateRequest;

/**
 * Search/Filter Response
 */
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

/**
 * Single Item Response
 */
export interface LookupExtensionResponse {
  success: boolean;
  data: LookupExtensionApi;
  message: string;
}

/**
 * Delete Response
 */
export interface LookupExtensionDeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Search/Filter Query Parameters
 */
export interface LookupExtensionSearchParams {
  extensionCode?: string;
  field?: string;
  name?: string;
  systemDefined?: string;
  page?: number;
  size?: number;
}

// ========================================
// UI TYPES (for internal use)
// ========================================

/**
 * UI Field Row (Fields tab)
 */
export interface LookupExtensionFieldUI {
  id: string;
  element: string;
  displayName: string;
  dataType: string;
  lookupCode?: string;
  required?: boolean;
  draft?: boolean;
}

/**
 * UI Entry Row (Entries tab)
 */
export interface LookupExtensionEntryUI {
  id: string;
  lookupValue: string;
  values?: Record<string, any>;
  draft?: boolean;
}

/**
 * UI Lookup Extension (full object for dialog)
 */
export interface LookupExtensionUI {
  extensionId: string; // maps to extensionCode
  displayName: string; // maps to name
  lookupCode: string; // maps to field
  systemDefined: boolean; // maps to systemSw
  userMapping: boolean; // maps to userMappingSw
  multipleOccurrences: boolean; // maps to multipleOccurrencesSw
  fields: LookupExtensionFieldUI[];
  entries: LookupExtensionEntryUI[];
  version?: number;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
}

// ========================================
// ERROR TYPES
// ========================================

/**
 * API Error Response
 */
export interface ApiError {
  message: string;
  status?: number;
  details?: any;
}
