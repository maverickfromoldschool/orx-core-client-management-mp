/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';
import {AxiosError} from 'axios';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import axiosClient from '../lib/axios-client';
import {AddProductSchemaType} from '../features/products-listing/schemas/add-product-schema';
import {SAVE_PRODUCT_URL} from '../contants/api';

/**
 * Response schema for product save operation
 */
const saveProductResponseSchema = z.object({
  success: z.boolean(),
  message: z.object({
    createdBy: z.string().nullable().optional(),
    modifiedBy: z.string().nullable().optional(),
    createdDate: z.string().nullable().optional(),
    modifiedDate: z.string().nullable().optional(),
    version: z.number(),
    productId: z.string(),
    productName: z.string(),
    status: z.string(),
    productCode: z.string(),
    baseUom: z.string(),
    effectiveDate: z.string(),
    expiryDate: z.string().nullable().optional(),
    chargeTypeCode: z.string(),
    productType: z.string(),
    productGroup: z.string(),
    internalUse: z.string(),
    accountingCode: z.string().nullable().optional(),
    productGroupName: z.string().nullable().optional(),
    productCategory: z.string().nullable().optional(),
    productDescription: z.string().nullable().optional(),
    productSectorCd: z.string().nullable().optional()
  }),
  data: z.string()
});

export type SaveProductResponse = z.infer<typeof saveProductResponseSchema>;

/**
 * Request payload type for saving a product
 */
interface SaveProductPayload {
  productName: string;
  status: string;
  productCode: string;
  productDescription?: string;
  baseUom: string;
  effectiveDate: string;
  expiryDate?: string;
  accountingCode?: string;
  chargeTypeCode: string;
  productType: string;
  productGroup: string;
  internalUse?: string;
  productSectorCd?: string;
}

/**
 * Custom hook for saving a product
 * @returns {Object} Hook state and save function
 * @property {boolean} isLoading - Loading state during API call
 * @property {SaveProductResponse | null} data - Response data on success
 * @property {Function} saveProduct - Function to trigger product save
 */
export const useSaveProduct = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState<SaveProductResponse | null>(null);
  const {showError, showSuccess} = useNotification();

  /**
   * Save product to the API
   * @param {AddProductSchemaType} formData - Validated form data
   */
  const saveProduct = React.useCallback(async (formData: AddProductSchemaType): Promise<SaveProductResponse | null> => {
    setIsLoading(true);
    setData(null);

    try {
      // Transform form data to API payload format
      const payload: SaveProductPayload = {
        productName: formData.productName,
        status: 'ACT', // Default status
        productCode: formData.productCode,
        productDescription: '', // Optional field
        baseUom: formData.baseUom,
        effectiveDate: `${formData.effectiveDate}T00:00:00`, // Convert to ISO format
        accountingCode: formData.accountingCode || undefined,
        chargeTypeCode: formData.chargeType,
        productType: formData.productType,
        productGroup: formData.productGroup,
        internalUse: 'N', // Default value
        productSectorCd: undefined // Optional field
      };

      const response = await axiosClient.post(SAVE_PRODUCT_URL, payload);

      // Validate response schema
      const parsed = saveProductResponseSchema.safeParse(response.data);
      if (!parsed.success) {
        // eslint-disable-next-line no-console
        console.error('Response validation error:', parsed.error);
        showError('An error occurred while saving the product. Please try again.');
        return null;
      }

      setData(parsed.data);
      showSuccess('Product saved successfully!');

      return parsed.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data as {success: boolean; details: {field: string; message: string}[]};
        if (errorMessage?.details?.length > 0) {
          const firstError = errorMessage.details[0];
          if (firstError) {
            showError(firstError.message);
            return null;
          }
        }
      }
      // eslint-disable-next-line no-console
      console.error('Product save error:', err);
      showError('An error occurred while saving the product. Please try again.');
    } finally {
      setIsLoading(false);
    }

    return null;
  }, []);

  return {
    isLoading,
    data,
    saveProduct
  };
};
