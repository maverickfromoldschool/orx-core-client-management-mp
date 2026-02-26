/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import axiosClient from '../lib/axios-client';
import {GET_PRODUCT_BY_ID_URL} from '../contants/api';

/**
 * Product variant schema
 */
const productVariantSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  productVariantId: z.string(),
  variant: z.string(),
  variantName: z.string().nullable().optional(),
  fieldType: z.string().nullable().optional(),
  predefinedField: z.string().nullable().optional(),
  dataType: z.string().nullable().optional(),
  productId: z.string(),
  priorityOrder: z.number(),
  priceDetermination: z.string(),
  transactionProcessing: z.string(),
  defaultVariantValue: z.string().nullable().optional(),
  predefinedSw: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  entity: z.string().nullable().optional(),
  attribute: z.string().nullable().optional(),
  startDate: z.string(),
  endDate: z.string().nullable().optional(),
  productCode: z.string().nullable().optional(),
  productGroup: z.string().nullable().optional(),
  variantValues: z.unknown().nullable().optional()
});

/**
 * Product attribute schema
 */
const productAttributeSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  productExtId: z.string(),
  productId: z.string(),
  attribute: z.string(),
  description: z.string().nullable(),
  dataType: z.string().nullable(),
  attributeVal: z.string(),
  startDt: z.string(),
  endDt: z.string().optional().nullable(),
  uom: z.string().nullable()
});

/**
 * Product detail schema from API
 */
const productDetailSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
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
});

/**
 * Get product by ID response schema
 */
const getProductByIdResponseSchema = z.object({
  success: z.boolean(),
  message: z.object({
    product: productDetailSchema,
    productVariants: z.array(productVariantSchema),
    productAttributes: z.array(productAttributeSchema),
    priceListEntryPresent: z.null().or(z.unknown())
  }),
  data: z.string()
});

/**
 * Product detail type
 */
export type ProductDetail = z.infer<typeof productDetailSchema>;

/**
 * Product variant type
 */
export type ProductVariant = z.infer<typeof productVariantSchema>;

/**
 * Product attribute type
 */
export type ProductAttribute = z.infer<typeof productAttributeSchema>;

/**
 * Complete product information including variants and attributes
 */
export interface ProductWithDetails {
  product: ProductDetail;
  productVariants: ProductVariant[];
  productAttributes: ProductAttribute[];
  priceListEntryPresent?: null | unknown;
}

/**
 * Return type for useGetProductById hook
 */
export interface UseGetProductByIdReturn {
  productData: ProductWithDetails | null;
  isLoading: boolean;
  error: Error | null;
  fetchProduct: (productId: string) => Promise<void>;
  refetch: () => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for fetching a product by ID
 * @param {string} productId - Optional product ID to fetch on mount
 * @returns {UseGetProductByIdReturn} Hook state and fetch functions
 */
export const useGetProductById = (productId?: string): UseGetProductByIdReturn => {
  const [productData, setProductData] = React.useState<ProductWithDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [lastProductId, setLastProductId] = React.useState<string | undefined>(productId);
  const {showError} = useNotification();

  /**
   * Fetch product by ID from the API
   * @param {string} id - Product ID to fetch
   */
  const fetchProduct = React.useCallback(
    async (id: string) => {
      if (!id) {
        setError(new Error('Product ID is required'));
        showError('Product ID is required');
        return;
      }

      setIsLoading(true);
      setError(null);
      setLastProductId(id);

      try {
        const url = `${GET_PRODUCT_BY_ID_URL}/${id}`;
        const response = await axiosClient.get(url);

        // Validate response status
        if (response.status !== 200) {
          throw new Error('Failed to fetch product');
        }

        // Validate response schema
        const parsed = getProductByIdResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error('Response validation error:', parsed.error);
          throw new Error('Invalid response format');
        }

        // Check if the request was successful
        if (!parsed.data.success) {
          throw new Error(parsed.data.data || 'Failed to retrieve product');
        }

        // Set product data
        setProductData(parsed.data.message);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An error occurred while fetching product');
        setError(errorObj);
        // eslint-disable-next-line no-console
        console.error('Product fetch error:', err);
        showError('An error occurred while fetching product details. Please try again.');

        // Set empty state on error
        setProductData(null);
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  /**
   * Refetch product using the last product ID
   */
  const refetch = React.useCallback(async () => {
    if (lastProductId) {
      await fetchProduct(lastProductId);
    }
  }, [fetchProduct, lastProductId]);

  /**
   * Reset the hook state
   */
  const reset = React.useCallback(() => {
    setProductData(null);
    setIsLoading(false);
    setError(null);
    setLastProductId(undefined);
  }, []);

  // Fetch product on mount if product ID is provided
  React.useEffect(() => {
    if (productId) {
      void fetchProduct(productId);
    }
  }, []); // Only run on mount

  return {
    productData,
    isLoading,
    error,
    fetchProduct,
    refetch,
    reset
  };
};
