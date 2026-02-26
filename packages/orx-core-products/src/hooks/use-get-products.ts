/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import axiosClient from '../lib/axios-client';
import {Product} from '../features/products-listing/types';
import {GET_PRODUCTS_URL} from '../contants/api';

/**
 * Product API response schema
 */
const productApiResponseSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  productCode: z.string(),
  chargeTypeCode: z.string(),
  chargeTypeCodeDesc: z.string(),
  productGroup: z.string(),
  productType: z.string(),
  productTypeDesc: z.string(),
  effectiveDate: z.string(),
  status: z.string(),
  variants: z.null().or(z.unknown()),
  relationships: z.null().or(z.unknown()),
  attributes: z.null().or(z.unknown()),
  priceListEntryPresent: z.null().or(z.unknown()),
  administrativeGroup: z.null().or(z.unknown()),
  internalUse: z.string(),
  productCategory: z.string().nullable(),
  productDescription: z.string().optional().nullable(),
  productSectorCd: z.string().nullable()
});

/**
 * Get products response schema
 */
const getProductsResponseSchema = z.object({
  success: z.boolean(),
  message: z.object({
    totalPages: z.number(),
    currentPage: z.number(),
    totalRecord: z.number(),
    data: z.array(productApiResponseSchema)
  }),
  data: z.string()
});

/**
 * Query parameters for getting products
 */
export interface GetProductsParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  filters?: {
    productType?: string;
    productGroup?: string;
    chargeType?: string;
    status?: string;
  };
}

/**
 * Return type for useGetProducts hook
 */
export interface UseGetProductsReturn {
  products: Product[];
  isLoading: boolean;
  error: Error | null;
  totalPages: number;
  currentPage: number;
  totalCount: number;
  fetchProducts: (params?: GetProductsParams) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Transform API product response to UI Product interface
 * @param {ProductApiResponse} apiProduct - Product from API
 * @returns {Product} Transformed product for UI
 */
const transformProduct = (productApiResponse: z.infer<typeof productApiResponseSchema>): Product => {
  return {
    id: productApiResponse.productId,
    product: productApiResponse.productName,
    productCode: productApiResponse.productCode,
    productGroup: productApiResponse.productGroup,
    productType: productApiResponse.productType,
    productTypeDesc: productApiResponse.productTypeDesc,
    chargeType: productApiResponse.chargeTypeCode,
    chargeTypeCodeDesc: productApiResponse.chargeTypeCodeDesc,
    effectiveDate: productApiResponse.effectiveDate,
    status: productApiResponse.status === 'ACT' ? 'active' : 'inactive'
  };
};

/**
 * Custom hook for fetching products with pagination
 * @param {GetProductsParams} initialParams - Initial query parameters
 * @returns {UseGetProductsReturn} Hook state and fetch functions
 */
export const useGetProducts = (initialParams?: GetProductsParams): UseGetProductsReturn => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [totalCount, setTotalCount] = React.useState(0);
  const [lastParams, setLastParams] = React.useState<GetProductsParams | undefined>(initialParams);
  const {showError} = useNotification();

  /**
   * Fetch products from the API
   * @param {GetProductsParams} params - Query parameters for fetching products
   */
  const fetchProducts = React.useCallback(
    async (params?: GetProductsParams) => {
      setIsLoading(true);
      setError(null);
      setLastParams(params);
      console.log({params});

      try {
        // Build query parameters
        const queryParams = new URLSearchParams();

        if (params?.page !== undefined) {
          queryParams.append('page', params.page.toString());
        }

        if (params?.pageSize !== undefined) {
          queryParams.append('size', params.pageSize.toString());
        }

        if (params?.searchTerm) {
          queryParams.append('search', params.searchTerm);
        }

        if (params?.filters) {
          if (params.filters.productType) {
            queryParams.append('productType', params.filters.productType);
          }
          if (params.filters.productGroup) {
            queryParams.append('productGroup', params.filters.productGroup);
          }
          if (params.filters.chargeType) {
            queryParams.append('chargeType', params.filters.chargeType);
          }
          if (params.filters.status) {
            queryParams.append('status', params.filters.status);
          }
        }

        queryParams.append('sortBy', 'desc:createdDate');

        const url = queryParams.toString() ? `${GET_PRODUCTS_URL}?${queryParams.toString()}` : GET_PRODUCTS_URL;

        const response = await axiosClient.get(url);

        // Validate response status
        if (response.status !== 200) {
          throw new Error('Failed to fetch products');
        }

        // Validate response schema
        const parsed = getProductsResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error('Response validation error:', parsed.error);
          throw new Error('Invalid response format');
        }

        // Transform and set products
        const transformedProducts = parsed.data.message.data.map(transformProduct);
        setProducts(transformedProducts);
        setTotalPages(parsed.data.message.totalPages);
        setCurrentPage(parsed.data.message.currentPage);
        setTotalCount(parsed.data.message.totalRecord);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An error occurred while fetching products');
        setError(errorObj);
        // eslint-disable-next-line no-console
        console.error('Product fetch error:', err);
        showError('An error occurred while fetching products. Please try again.');

        // Set empty state on error
        setProducts([]);
        setTotalPages(0);
        setCurrentPage(0);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  /**
   * Refetch products using the last parameters
   */
  const refetch = React.useCallback(async () => {
    await fetchProducts(lastParams);
  }, [fetchProducts, lastParams]);

  // Fetch products on mount if initial params are provided
  React.useEffect(() => {
    if (initialParams) {
      void fetchProducts(initialParams);
    }
  }, []); // Only run on mount

  return {
    products,
    isLoading,
    error,
    totalPages,
    currentPage,
    totalCount,
    fetchProducts,
    refetch
  };
};
