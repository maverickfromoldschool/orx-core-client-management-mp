/* eslint-disable @typescript-eslint/no-floating-promises */
import React from 'react';
import {z} from 'zod';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import axiosClient from '../lib/axios-client';
import {PRODUCT_GROUP_URL} from '../contants/api';

/**
 * Product group variant schema
 */
const productGroupVariantSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  productGroup: z.string(),
  variant: z.string(),
  variantName: z.string().nullable()
});

/**
 * Product group attribute schema
 */
const productGroupAttributeSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  productGroup: z.string(),
  attribute: z.string()
});

/**
 * Product group detail schema
 */
const productGroupDetailSchema = z.object({
  createdBy: z.string().nullable().optional(),
  modifiedBy: z.string().nullable().optional(),
  createdDate: z.string().nullable().optional(),
  modifiedDate: z.string().nullable().optional(),
  version: z.number(),
  productGroup: z.string(),
  name: z.string(),
  productCategory: z.string().nullable().optional(),
  uom: z.string().nullable().optional(),
  externalSystem: z.string().nullable().optional(),
  externalReferenceNumber: z.string().nullable().optional(),
  accountingCode: z.string().nullable().optional(),
  displaySequence: z.number(),
  notes: z.string().nullable().optional(),
  administrativeGroup: z.string().nullable().optional(),
  billingDeterminants: z.string().nullable().optional(),
  productGroupVariantList: z.array(productGroupVariantSchema),
  productGroupAttributeList: z.array(productGroupAttributeSchema),
  productVariantValueDtos: z.null().or(z.unknown())
});

/**
 * Get product group response schema
 */
const getProductGroupResponseSchema = z.object({
  success: z.boolean(),
  data: productGroupDetailSchema,
  message: z.string()
});

/**
 * Product group variant type
 */
export type ProductGroupVariant = z.infer<typeof productGroupVariantSchema>;

/**
 * Product group attribute type
 */
export type ProductGroupAttribute = z.infer<typeof productGroupAttributeSchema>;

/**
 * Product group detail type
 */
export type ProductGroupDetail = z.infer<typeof productGroupDetailSchema>;

/**
 * Return type for useGetProductGroup hook
 */
export interface UseGetProductGroupReturn {
  productGroupData: ProductGroupDetail | null;
  isLoading: boolean;
  error: Error | null;
  fetchProductGroup: (productGroupCode: string) => Promise<void>;
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for fetching a product group by code
 * @param {string} productGroupCode - Optional product group code to fetch on mount
 * @returns {UseGetProductGroupReturn} Hook state and fetch functions
 *
 * @example
 * ```tsx
 * // Fetch on mount
 * const { productGroupData, isLoading, error } = useGetProductGroup('CORE');
 *
 * // Manual fetch
 * const { productGroupData, fetchProductGroup, isLoading } = useGetProductGroup();
 * // Later...
 * await fetchProductGroup('CORE');
 * ```
 */
export const useGetProductGroup = (productGroupCode?: string): UseGetProductGroupReturn => {
  const [productGroupData, setProductGroupData] = React.useState<ProductGroupDetail | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [lastProductGroupCode, setLastProductGroupCode] = React.useState<string | undefined>(productGroupCode);
  const {showError} = useNotification();

  /**
   * Fetches product group data from the API
   */
  const fetchProductGroup = React.useCallback(
    async (code: string) => {
      if (!code || code.trim() === '') {
        const validationError = new Error('Product group code is required');
        setError(validationError);
        showError('Product group code is required');

        return;
      }

      setIsLoading(true);
      setError(null);
      setLastProductGroupCode(code);

      try {
        const response = await axiosClient.get(`${PRODUCT_GROUP_URL}/${code}`);

        // Validate response structure
        const validatedData = getProductGroupResponseSchema.parse(response.data);

        if (!validatedData.success) {
          throw new Error(validatedData.message || 'Failed to fetch product group');
        }

        setProductGroupData(validatedData.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching product group';
        const fetchError = new Error(errorMessage);

        setError(fetchError);
        setProductGroupData(null);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  /**
   * Refetches the last product group that was requested
   */
  const refetch = React.useCallback(async () => {
    if (lastProductGroupCode) {
      await fetchProductGroup(lastProductGroupCode);
    }
  }, [lastProductGroupCode, fetchProductGroup]);

  /**
   * Resets the hook state to initial values
   */
  const reset = React.useCallback(() => {
    setProductGroupData(null);
    setIsLoading(false);
    setError(null);
    setLastProductGroupCode(undefined);
  }, []);

  // Fetch on mount if productGroupCode is provided
  React.useEffect(() => {
    if (productGroupCode && productGroupCode.trim() !== '') {
      fetchProductGroup(productGroupCode);
    }
  }, []); // Only run on mount

  return {
    productGroupData,
    isLoading,
    error,
    fetchProductGroup,
    refetch,
    reset
  };
};
