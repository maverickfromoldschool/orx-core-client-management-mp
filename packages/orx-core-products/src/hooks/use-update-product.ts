/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import axiosClient from '../lib/axios-client';
import {UPDATE_PRODUCT_URL} from '../contants/api';

/**
 * Product update payload schema
 */
const updateProductPayloadSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productCode: z.string(),
  baseUom: z.string(),
  effectiveDate: z.string(),
  expiryDate: z.string().nullable().optional(),
  chargeTypeCode: z.string(),
  productType: z.string(),
  productGroup: z.string(),
  status: z.string(),
  accountingCode: z.string().optional().nullable()
});

/**
 * Updated product response schema
 */
const updatedProductSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string().optional().nullable(),
  modifiedDate: z.string().optional().nullable(),
  version: z.number(),
  productId: z.string(),
  productName: z.string(),
  status: z.string(),
  productCode: z.string(),
  baseUom: z.string(),
  effectiveDate: z.string(),
  expiryDate: z.string().nullable(),
  chargeTypeCode: z.string(),
  productType: z.string(),
  productGroup: z.string(),
  internalUse: z.string(),
  accountingCode: z.string().optional().nullable(),
  productGroupName: z.string().nullable(),
  productCategory: z.string().nullable(),
  productDescription: z.string().optional().nullable(),
  productSectorCd: z.string().optional().nullable()
});

/**
 * Update product API response schema
 */
const updateProductResponseSchema = z.object({
  success: z.boolean(),
  message: updatedProductSchema,
  data: z.string()
});

/**
 * Product update payload type
 */
export type UpdateProductPayload = z.infer<typeof updateProductPayloadSchema>;

/**
 * Updated product type
 */
export type UpdatedProduct = z.infer<typeof updatedProductSchema>;

/**
 * Update product response type
 */
export type UpdateProductResponse = z.infer<typeof updateProductResponseSchema>;

/**
 * Return type for useUpdateProduct hook
 */
export interface UseUpdateProductReturn {
  updatedProduct: UpdatedProduct | null;
  isLoading: boolean;
  error: Error | null;
  updateProduct: (payload: UpdateProductPayload) => Promise<UpdatedProduct | null>;
  reset: () => void;
}

/**
 * Custom hook for updating a product
 * @returns {UseUpdateProductReturn} Hook state and update function
 *
 * @example
 * ```tsx
 * const { updateProduct, isLoading, error, updatedProduct } = useUpdateProduct();
 *
 * const handleSave = async () => {
 *   const result = await updateProduct({
 *     productId: "40289fef9c3278b4019c327984230000",
 *     productName: "Specialty Drug Coverage1",
 *     status: "ACT",
 *     productCode: "PRD00234d",
 *     productDescription: "",
 *     baseUom: "MONTH",
 *     effectiveDate: "2025-04-01T00:00:00",
 *     expiryDate: null,
 *     accountingCode: "ACC2002",
 *     chargeTypeCode: "CHG",
 *     productType: "SPC",
 *     productGroup: "SPECIALTY",
 *     internalUse: "N",
 *     productSectorCd: "SPEC"
 *   });
 *
 *   if (result) {
 *     console.log('Product updated successfully:', result);
 *   }
 * };
 * ```
 */
export const useUpdateProduct = (): UseUpdateProductReturn => {
  const [updatedProduct, setUpdatedProduct] = React.useState<UpdatedProduct | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const {showError, showSuccess} = useNotification();

  /**
   * Update product via API
   * @param {UpdateProductPayload} payload - Product data to update
   * @returns {Promise<UpdatedProduct | null>} Updated product data or null on error
   */
  const updateProduct = React.useCallback(
    async (payload: UpdateProductPayload): Promise<UpdatedProduct | null> => {
      // Validate payload
      const validationResult = updateProductPayloadSchema.safeParse(payload);
      if (!validationResult.success) {
        const validationError = new Error('Invalid product data');
        setError(validationError);
        showError('Invalid product data. Please check all required fields.');
        // eslint-disable-next-line no-console
        console.error('Payload validation error:', validationResult.error);
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axiosClient.put(UPDATE_PRODUCT_URL, validationResult.data);

        // Validate response status
        if (response.status !== 200) {
          throw new Error('Failed to update product');
        }

        // Validate response schema
        const parsed = updateProductResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error('Response validation error:', parsed.error);
          throw new Error('Invalid response format');
        }

        // Check if the request was successful
        if (!parsed.data.success) {
          throw new Error(parsed.data.data || 'Failed to update product');
        }

        // Set updated product data
        setUpdatedProduct(parsed.data.message);

        // Show success notification
        showSuccess(parsed.data.data || 'Product updated successfully');

        return parsed.data.message;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An error occurred while updating product');
        setError(errorObj);
        // eslint-disable-next-line no-console
        console.error('Product update error:', err);
        showError('An error occurred while updating the product. Please try again.');

        // Set empty state on error
        setUpdatedProduct(null);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showError, showSuccess]
  );

  /**
   * Reset the hook state
   */
  const reset = React.useCallback(() => {
    setUpdatedProduct(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    updatedProduct,
    isLoading,
    error,
    updateProduct,
    reset
  };
};
