import {useState, useCallback} from 'react';
import dayjs from 'dayjs';

import axiosClient from '../lib/axios-client';
import {
  ASSIGN_PRODUCT_ATTRIBUTE_URL,
  UPDATE_PRODUCT_ATTRIBUTE_URL,
  DELETE_PRODUCT_ATTRIBUTE_URL
} from '../contants/api';

/**
 * Parameters for assigning a product attribute
 */
export interface AssignProductAttributeParams {
  attribute: string;
  attributeVal: string;
  endDate?: string | null | undefined; // Format: MM/DD/YYYY
  productExtId?: string | null | undefined;
  startDate: string; // Format: MM/DD/YYYY
  productId: string;
}

/**
 * Parameters for updating a product attribute
 */
export interface UpdateProductAttributeParams {
  productExtId: string;
  productId: string;
  attribute: string;
  attributeVal: string;
  startDate: string; // Format: MM/DD/YYYY
  endDate?: string | null | undefined; // Format: MM/DD/YYYY
}

/**
 * Parameters for deleting a product attribute
 */
export interface DeleteProductAttributeParams {
  productExtId: string;
}

/**
 * API payload structure
 */
interface AssignProductAttributePayload {
  productId: string;
  attribute: string;
  attributeVal: string;
  startDt: string; // Format: YYYY-MM-DDTHH:mm:ss
  endDt?: string | null | undefined; // Format: YYYY-MM-DDTHH:mm:ss
}

/**
 * Update API payload structure
 */
interface UpdateProductAttributePayload {
  productExtId: string;
  productId: string;
  attribute: string;
  attributeVal: string;
  startDt: string; // Format: YYYY-MM-DDTHH:mm:ss
  endDt?: string | null | undefined; // Format: YYYY-MM-DDTHH:mm:ss
}

/**
 * Product attribute response data
 */
export interface ProductAttributeResponse {
  createdBy: string;
  modifiedBy: string;
  createdDate: string;
  modifiedDate: string;
  version: number;
  productExtId: string;
  productId: string;
  attribute: string;
  description: string | null;
  dataType: string | null;
  attributeVal: string;
  startDt: string;
  endDt: string;
  uom: string | null;
}

/**
 * API response structure
 */
interface AssignProductAttributeResponse {
  success: boolean;
  message: ProductAttributeResponse[];
  data: string;
}

/**
 * Update API response structure (message is a single object, not an array)
 */
interface UpdateProductAttributeResponse {
  success: boolean;
  message: ProductAttributeResponse;
  data: string;
}

/**
 * Hook return type
 */
export interface UseAssignProductAttributeReturn {
  assignAttribute: (params: AssignProductAttributeParams) => Promise<ProductAttributeResponse | null>;
  updateAttribute: (params: UpdateProductAttributeParams) => Promise<ProductAttributeResponse | null>;
  deleteAttribute: (params: DeleteProductAttributeParams) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
  data: ProductAttributeResponse | null;
  reset: () => void;
}

/**
 * Formats a date string from MM/DD/YYYY to YYYY-MM-DDTHH:mm:ss
 * @param dateString - Date in MM/DD/YYYY format
 * @param time - Time to append (00:00:00 or 23:59:59)
 * @returns Formatted date string in YYYY-MM-DDTHH:mm:ss format
 */
const formatDateTime = (dateString: string, time: '00:00:00' | '23:59:59'): string => {
  const date = dayjs(dateString, 'MM/DD/YYYY');
  return `${date.format('YYYY-MM-DD')}T${time}`;
};

/**
 * Custom hook for assigning product attributes
 * Handles the API call to assign attributes to a product with proper date formatting
 *
 * @returns {UseAssignProductAttributeReturn} Hook state and assignment function
 *
 * @example
 * ```tsx
 * const { assignAttribute, isLoading, error, data } = useAssignProductAttribute();
 *
 * const handleAssign = async () => {
 *   const result = await assignAttribute({
 *     attribute: "TES-A",
 *     attributeVal: "TB",
 *     endDate: "01/31/2027",
 *     productExtId: "297e01829c55d503019c63ec76f5000e",
 *     startDate: "01/01/2025",
 *     productId: "1234"
 *   });
 *
 *   if (result) {
 *     console.log('Attribute assigned successfully:', result);
 *   }
 * };
 * ```
 */
export const useAssignProductAttribute = (): UseAssignProductAttributeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<ProductAttributeResponse | null>(null);

  /**
   * Reset hook state to initial values
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setData(null);
  }, []);

  /**
   * Assign a product attribute
   * @param params - Assignment parameters
   * @returns The assigned attribute data or null if failed
   */
  const assignAttribute = useCallback(
    async (params: AssignProductAttributeParams): Promise<ProductAttributeResponse | null> => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        // Format dates
        const startDt = formatDateTime(params.startDate, '00:00:00');
        const endDt = params.endDate ? formatDateTime(params.endDate, '23:59:59') : null;

        // Prepare payload
        const payload: AssignProductAttributePayload[] = [
          {
            productId: params.productId,
            attribute: params.attribute,
            attributeVal: params.attributeVal,
            startDt,
            endDt
          }
        ];

        // Make API call
        const response = await axiosClient.post<AssignProductAttributeResponse>(ASSIGN_PRODUCT_ATTRIBUTE_URL, payload);

        // Validate response
        if (response.status !== 200) {
          throw new Error('Failed to assign product attribute');
        }

        if (!response.data.success) {
          throw new Error(response.data.data || 'Failed to assign product attribute');
        }

        // Get the first item from the response message array
        const attributeData = response.data.message[0];

        if (!attributeData) {
          throw new Error('No attribute data returned from server');
        }

        setData(attributeData);
        return attributeData;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An error occurred while assigning product attribute');
        setError(errorObj);
        // eslint-disable-next-line no-console
        console.error('Product attribute assignment error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Update an existing product attribute
   * @param params - Update parameters
   * @returns The updated attribute data or null if failed
   */
  const updateAttribute = useCallback(
    async (params: UpdateProductAttributeParams): Promise<ProductAttributeResponse | null> => {
      setIsLoading(true);
      setError(null);
      setData(null);

      try {
        // Format dates
        const startDt = formatDateTime(params.startDate, '00:00:00');
        const endDt = params.endDate ? formatDateTime(params.endDate, '23:59:59') : null;

        // Prepare payload
        const payload: UpdateProductAttributePayload = {
          productExtId: params.productExtId,
          productId: params.productId,
          attribute: params.attribute,
          attributeVal: params.attributeVal,
          startDt,
          endDt
        };

        // Make API call
        const response = await axiosClient.put<UpdateProductAttributeResponse>(UPDATE_PRODUCT_ATTRIBUTE_URL, payload);

        // Validate response
        if (response.status !== 200) {
          throw new Error('Failed to update product attribute');
        }

        if (!response.data.success) {
          throw new Error(response.data.data || 'Failed to update product attribute');
        }

        // Get the attribute data from response (single object, not array)
        const attributeData = response.data.message;

        if (!attributeData) {
          throw new Error('No attribute data returned from server');
        }

        setData(attributeData);
        return attributeData;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An error occurred while updating product attribute');
        setError(errorObj);
        // eslint-disable-next-line no-console
        console.error('Product attribute update error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Delete a product attribute
   * @param params - Delete parameters
   * @returns true if successful, false otherwise
   */
  const deleteAttribute = useCallback(async (params: DeleteProductAttributeParams): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Make API call with productExtId as path parameter
      const response = await axiosClient.delete(`${DELETE_PRODUCT_ATTRIBUTE_URL}/${params.productExtId}`);

      // Validate response
      if (response.status !== 200) {
        throw new Error('Failed to delete product attribute');
      }

      // Clear data on successful deletion
      setData(null);
      return true;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('An error occurred while deleting product attribute');
      setError(errorObj);
      // eslint-disable-next-line no-console
      console.error('Product attribute deletion error:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    assignAttribute,
    updateAttribute,
    deleteAttribute,
    isLoading,
    error,
    data,
    reset
  };
};
