/**
 * Type definitions for Variants API
 */

/** Variant interface matching API response structure */
export interface VariantApiResponse {
  variant: string;
  name: string;
  dataType: string;
  systemDefinedLookup: string;
  predefinedSw: string;
  entity: string | null;
  attribute?: string;
  fieldType?: string;
  predefinedField?: string;
  notes?: string;
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
  variantValues?: VariantValue[];
}

/** Variant value in variantValues array */
export interface VariantValue {
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
  version: number;
  variant: string;
  variantValue: string;
  description: string;
  dataJson: string | null;
}

/** Request payload for creating a variant */
export interface VariantCreateRequest {
  variant: string;
  name: string;
  dataType: string;
  systemDefinedLookup: string;
  predefinedSw: string;
  entity: string;
  attribute?: string;
  attributeName?: string;
  fieldType?: string;
  predefinedField?: string;
  notes?: string;
  applyToAttribute: string;
  createdBy: string;
  modifiedBy: string;
  variantValues?: {
    variant: string;
    variantValue: string;
    description: string;
    createdBy: string;
    modifiedBy: string;
  }[];
}

/** Request payload for updating a variant */
export interface VariantUpdateRequest {
  variant: string;
  name: string;
  dataType: string;
  systemDefinedLookup: string;
  predefinedSw: string;
  entity: string | null;
  attribute?: string;
  attributeName?: string;
  fieldType?: string | null;
  predefinedField?: string | null;
  notes?: string;
  applyToAttribute: string;
  createdBy: string;
  modifiedBy: string;
  variantValues?: {
    variant: string;
    variantValue: string;
    description: string;
    createdBy: string;
    modifiedBy: string;
  }[];
}

/** API response structure */
export interface VariantsApiResponse {
  success: boolean;
  data: {
    currentPage: number;
    totalPages: number;
    totalRecord: number;
    data: VariantApiResponse[];
  };
  message: string;
}

/** Query parameters for getting variants */
export interface GetVariantsParams {
  page?: number;
  size?: number;
  variantField?: string;
  variantName?: string;
  systemDefined?: string;
  predefinedList?: string;
  entity?: string;
  isIgnoreChildEntities?: string;
}
