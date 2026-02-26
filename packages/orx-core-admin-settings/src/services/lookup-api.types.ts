/**
 * Type definitions for Lookup API
 * These types can be imported and used throughout the application
 */

/** Lookup field value interface (API response format) */
export interface LookupFieldValueApi {
  id: {
    field: string;
    fieldVal: string;
  };
  disableDisplaySw: 'Y' | 'N';
  displayName?: string;
  createdBy: string;
  creationDttm: string | null;
  modifiedBy: string | null;
  modifiedDttm: string | null;
  version: number | null;
  notes: string | null;
}

/** Lookup field value interface (for create/update requests) */
export interface LookupFieldValueRequest {
  fieldVal: string;
  disableDisplaySw: 'Y' | 'N';
  displayName?: string;
  notes?: string;
}

/** Lookup field value interface (UI format) */
export interface LookupFieldValue {
  id: string;
  fieldValue: string;
  displayName: string;
  description?: string;
  disabled?: boolean;
}

/** Lookup field API response interface */
export interface LookupFieldApi {
  field: string;
  description: string;
  systemSw: boolean;
  numericSw: boolean;
  javaFieldName: string;
  createdBy: string;
  creationDttm: string | null;
  modifiedBy: string | null;
  modifiedDttm: string | null;
  version: number | null;
  ownerFlg: string | null;
  fieldLength: number | null;
  values: LookupFieldValueApi[];
  extensions: unknown[];
}

/** Lookup field interface (UI format) */
export interface LookupField {
  id: string;
  lookupField: string;
  displayName: string;
  managedBy: string;
  numericValue: boolean;
  maxStoredValueLength: string;
  values?: LookupFieldValue[];
}

/** Request payload for creating a lookup field */
export interface LookupFieldCreateRequest {
  field: string;
  description: string;
  systemSw: boolean;
  numericSw: boolean;
  javaFieldName: string;
  createdBy: string;
  fieldLength?: number;
  values?: LookupFieldValueRequest[];
}

/** Request payload for updating a lookup field */
export interface LookupFieldUpdateRequest {
  description: string;
  systemSw: boolean;
  numericSw: boolean;
  javaFieldName: string;
  modifiedBy: string;
  fieldLength?: number;
  values?: LookupFieldValueRequest[];
}

/** API search/list response structure */
export interface LookupFieldSearchResponse {
  content: LookupFieldApi[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

/** API error structure */
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
