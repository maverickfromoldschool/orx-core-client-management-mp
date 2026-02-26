import type {
  ProductGroupData,
  ProductGroupFormData,
  ProductGroupVariant,
  ProductGroupAttribute
} from './product-group-types';

/**
 * Converts API response data to UI form data
 * @param apiData - Data from API
 * @param selectedAttributes - Array of attribute values
 * @param selectedVariants - Array of variant values
 * @param notes - Notes text
 * @returns Form data for UI
 */
export function apiDataToFormData(
  apiData: ProductGroupData,
  selectedAttributes: string[] = [],
  selectedVariants: string[] = [],
  notes = ''
): {
  formData: ProductGroupFormData;
  selectedAttributes: string[];
  selectedVariants: string[];
  notes: string;
} {
  return {
    formData: {
      productGroup: apiData.productGroup,
      name: apiData.name,
      productCategory: apiData.productCategory,
      externalSystem: apiData.externalSystem || '',
      administrative: apiData.administrativeGroup === 'Y',
      retrievalSettings: false, // This field doesn't exist in API
      baseUOM: apiData.uom || '',
      billingDeterminants: apiData.billingDeterminants === 'Y',
      accountingCode: apiData.accountingCode || '',
      externalReferenceNumber: apiData.externalReferenceNumber || ''
    },
    selectedAttributes: apiData.productGroupAttributeList?.map((attr) => attr.attribute) || selectedAttributes,
    selectedVariants: apiData.productGroupVariantList?.map((variant) => variant.variant) || selectedVariants,
    notes: apiData.notes || notes
  };
}

/**
 * Converts UI form data to API request format
 * @param formData - Form data from UI
 * @param selectedAttributes - Array of attribute values
 * @param selectedVariants - Array of variant values
 * @param notes - Notes text
 * @param existingData - Existing data (for edit mode to preserve audit fields)
 * @returns Data ready for API request
 */
export function formDataToApiData(
  formData: ProductGroupFormData,
  selectedAttributes: string[],
  selectedVariants: string[],
  notes: string,
  existingData?: ProductGroupData
): ProductGroupData {
  const productGroupVariantList: ProductGroupVariant[] = selectedVariants.map((variant) => ({
    productGroup: formData.productGroup,
    variant,
    variantName: null
  }));

  const productGroupAttributeList: ProductGroupAttribute[] = selectedAttributes.map((attribute) => ({
    productGroup: formData.productGroup,
    attribute
  }));

  return {
    id: existingData?.id,
    productGroup: formData.productGroup,
    name: formData.name,
    productCategory: formData.productCategory,
    uom: formData.baseUOM || '',
    externalSystem: formData.externalSystem || '',
    externalReferenceNumber: formData.externalReferenceNumber || '',
    accountingCode: formData.accountingCode || '',
    displaySequence: existingData?.displaySequence || 1,
    notes,
    administrativeGroup: formData.administrative ? 'Y' : 'N',
    billingDeterminants: formData.billingDeterminants ? 'Y' : 'N',
    productGroupVariantList,
    productGroupAttributeList,
    productVariantValueDtos: null,
    // Preserve audit fields if editing
    ...(existingData && {
      createdBy: existingData.createdBy,
      createdDate: existingData.createdDate,
      modifiedBy: existingData.modifiedBy,
      modifiedDate: existingData.modifiedDate,
      version: existingData.version
    })
  };
}
