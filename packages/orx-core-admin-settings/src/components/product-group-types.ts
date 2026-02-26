/**
 * API response/request format for Product Group
 */
export interface ProductGroupData {
  id?: string;
  productGroup: string;
  name: string;
  productCategory: string;
  uom: string;
  externalSystem: string;
  externalReferenceNumber: string;
  accountingCode: string;
  displaySequence?: number;
  notes: string;
  administrativeGroup: string; // "Y" or "N"
  billingDeterminants: string; // "Y" or "N"
  productGroupVariantList: ProductGroupVariant[];
  productGroupAttributeList: ProductGroupAttribute[];
  productVariantValueDtos?: null;
  // Audit fields
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

/**
 * Variant nested in Product Group
 */
export interface ProductGroupVariant {
  productGroup: string;
  variant: string;
  variantName: string | null;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

/**
 * Attribute nested in Product Group
 */
export interface ProductGroupAttribute {
  productGroup: string;
  attribute: string;
  createdBy?: string;
  modifiedBy?: string;
  createdDate?: string;
  modifiedDate?: string;
  version?: number;
}

/**
 * UI form data type for dialog (user-friendly format)
 */
export interface ProductGroupFormData {
  productGroup: string;
  name: string;
  productCategory: string;
  externalSystem: string;
  administrative: boolean;
  retrievalSettings: boolean;
  baseUOM: string;
  billingDeterminants: boolean;
  accountingCode: string;
  externalReferenceNumber: string;
}
