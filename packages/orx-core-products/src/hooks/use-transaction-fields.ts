import {useState, useCallback} from 'react';

import axiosClient from '../lib/axios-client';
import {
  GET_TRANSACTION_FIELDS_URL,
  CREATE_TRANSACTION_FIELD_URL,
  UPDATE_TRANSACTION_FIELD_URL,
  DELETE_TRANSACTION_FIELD_URL
} from '../contants/api';

/**
 * Transaction field data structure
 */
export interface TransactionFieldData {
  id: string;
  transactionAttribute: string;
  label: string;
  dataType: string;
  unitOfMeasure: string;
  displaySequence: number;
  required: boolean;
  negativeAllowed: boolean;
  summarization: boolean;
  accountUsage: boolean;
  calculated: boolean;
  notes?: string;
}

/**
 * Parameters for creating a transaction field
 */
export interface CreateTransactionFieldParams {
  productId: string;
  transactionAttribute: string;
  label: string;
  dataType: string;
  unitOfMeasure: string;
  displaySequence: number;
  required: boolean;
  negativeAllowed: boolean;
  summarization: boolean;
  accountUsage: boolean;
  calculated: boolean;
  notes?: string;
}

/**
 * Parameters for updating a transaction field
 */
export interface UpdateTransactionFieldParams {
  productId: string;
  transactionAttribute: string;
  label: string;
  dataType: string;
  unitOfMeasure: string;
  displaySequence: number;
  required: boolean;
  negativeAllowed: boolean;
  summarization: boolean;
  accountUsage: boolean;
  calculated: boolean;
  notes?: string;
}

/**
 * Parameters for deleting a transaction field
 */
export interface DeleteTransactionFieldParams {
  productId: string;
  transactionAttribute: string;
}

/**
 * Parameters for fetching transaction fields
 */
export interface GetTransactionFieldsParams {
  productId?: string;
  page?: number;
  pageSize?: number;
}

/**
 * API field format (different from UI format)
 */
interface ApiTransactionField {
  productId: string;
  transactionAttribute: string;
  label: string;
  dataType: string;
  uom?: string;
  unitOfMeasure?: string;
  displaySequence: number;
  required: string | boolean;
  negativeAllowed: string | boolean;
  usagePooling: string | boolean;
  summarization?: boolean;
  accountUsage: string | boolean;
  calculated: string | boolean;
  notes?: string;
}

/**
 * API field format (different from UI format)
 */
interface ApiTransactionField {
  productId: string;
  transactionAttribute: string;
  label: string;
  dataType: string;
  uom?: string;
  unitOfMeasure?: string;
  displaySequence: number;
  required: string | boolean;
  negativeAllowed: string | boolean;
  usagePooling: string | boolean;
  summarization?: boolean;
  accountUsage: string | boolean;
  calculated: string | boolean;
  notes?: string;
}

/**
 * API response structure for getting transaction fields
 */
interface GetTransactionFieldsResponse {
  success: boolean;
  message: {
    totalPages: number;
    currentPage: number;
    totalRecord: number;
    data: ApiTransactionField[];
  };
  data: string;
}

/**
 * API response structure for create/update operations
 */
interface TransactionFieldResponse {
  success: boolean;
  message: TransactionFieldData;
  data: string;
}

/**
 * API response structure for delete operation
 */
interface DeleteTransactionFieldResponse {
  success: boolean;
  message: string;
  data: string;
}

/**
 * API error response structure
 */
export interface ApiError {
  message: string;
  details?: {field: string; message: string}[];
}
/**
 * Axios error response data structure
 */
interface ErrorResponseData {
  message?: string;
  details?: {field: string; message: string}[];
}
/**
 * Hook return type
 */
export interface UseTransactionFieldsReturn {
  getTransactionFields: (params?: GetTransactionFieldsParams) => Promise<TransactionFieldData[] | null>;
  createTransactionField: (params: CreateTransactionFieldParams) => Promise<TransactionFieldData>; // Throws on error
  updateTransactionField: (params: UpdateTransactionFieldParams) => Promise<TransactionFieldData>; // Throws on error
  deleteTransactionField: (params: DeleteTransactionFieldParams) => Promise<boolean>;
  isLoading: boolean;
  error: Error | null;
  apiError: ApiError | null;
  data: TransactionFieldData[] | null;
  totalCount: number;
  reset: () => void;
}

/**
 * Custom hook for managing transaction fields
 * Handles API calls for CRUD operations on transaction fields
 *
 * @returns {UseTransactionFieldsReturn} Hook state and transaction field functions
 *
 * @example
 * ```tsx
 * const {
 *   getTransactionFields,
 *   createTransactionField,
 *   updateTransactionField,
 *   deleteTransactionField,
 *   isLoading,
 *   error,
 *   data
 * } = useTransactionFields();
 *
 * // Fetch transaction fields
 * const fetchFields = async () => {
 *   const fields = await getTransactionFields({ productId: '123' });
 *   if (fields) {
 *     console.log('Transaction fields:', fields);
 *   }
 * };
 *
 * // Create a new transaction field
 * const handleCreate = async () => {
 *   const result = await createTransactionField({
 *     transactionAttribute: 'Quantity (QTY)',
 *     label: 'Item Count',
 *     dataType: 'Quantity',
 *     unitOfMeasure: 'EA',
 *     displaySequence: 1,
 *     required: false,
 *     negativeAllowed: false,
 *     summarization: true,
 *     accountUsage: false
 *   });
 *
 *   if (result) {
 *     console.log('Transaction field created:', result);
 *   }
 * };
 * ```
 */
export const useTransactionFields = (): UseTransactionFieldsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [apiError, setApiError] = useState<ApiError | null>(null);
  const [data, setData] = useState<TransactionFieldData[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  /**
   * Reset hook state to initial values
   */
  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setApiError(null);
    setData(null);
    setTotalCount(0);
  }, []);

  /**
   * Fetch transaction fields
   * @param params - Query parameters
   * @returns Array of transaction fields or null if failed
   */
  const getTransactionFields = useCallback(
    async (params?: GetTransactionFieldsParams): Promise<TransactionFieldData[] | null> => {
      setIsLoading(true);
      setError(null);

      try {
        if (!params?.productId) {
          throw new Error('Product ID is required to fetch transaction fields');
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) {
          queryParams.append('page', params.page.toString());
        }
        if (params.pageSize) {
          queryParams.append('size', params.pageSize.toString());
        }

        // Build URL with productId in path
        const url = `${GET_TRANSACTION_FIELDS_URL}/product/${params.productId}?${queryParams.toString()}`;

        // Make API call
        const response = await axiosClient.get<GetTransactionFieldsResponse>(url);

        // Validate response
        if (response.status !== 200) {
          throw new Error('Failed to fetch transaction fields');
        }

        if (!response.data.success) {
          throw new Error(response.data.data || 'Failed to fetch transaction fields');
        }

        const fields = response.data.message.data;
        const total = response.data.message.totalRecord;

        // Transform API response to UI format (usagePooling -> summarization, uom -> unitOfMeasure)
        const transformedFields: TransactionFieldData[] = fields.map((field) => ({
          ...field,
          id: field.transactionAttribute,
          unitOfMeasure: field.uom || field.unitOfMeasure || '',
          required: field.required === 'Y' || field.required === true,
          negativeAllowed: field.negativeAllowed === 'Y' || field.negativeAllowed === true,
          summarization: field.usagePooling === 'Y' || field.usagePooling === true,
          accountUsage: field.accountUsage === 'Y' || field.accountUsage === true,
          calculated: field.calculated === 'Y' || field.calculated === true
        }));

        setData(transformedFields);
        setTotalCount(total);
        return transformedFields;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An error occurred while fetching transaction fields');
        setError(errorObj);
        // eslint-disable-next-line no-console
        console.error('Transaction fields fetch error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Create a new transaction field
   * @param params - Creation parameters
   * @returns The created transaction field
   * @throws Error if creation fails
   */
  const createTransactionField = useCallback(
    async (params: CreateTransactionFieldParams): Promise<TransactionFieldData> => {
      setIsLoading(true);
      setError(null);
      setApiError(null);

      try {
        // Transform data to match API payload format
        const payload = {
          productId: params.productId,
          transactionAttribute: params.transactionAttribute,
          label: params.label,
          dataType: params.dataType,
          uom: params.unitOfMeasure,
          displaySequence: params.displaySequence,
          required: params.required ? 'Y' : 'N',
          negativeAllowed: params.negativeAllowed ? 'Y' : 'N',
          accountUsage: params.accountUsage ? 'Y' : 'N',
          usagePooling: params.summarization ? 'Y' : 'N',
          valueArray: 'N',
          calculated: params.calculated ? 'Y' : 'N',
          notes: params.notes || ''
        };

        // Make API call
        const response = await axiosClient.post<TransactionFieldResponse>(CREATE_TRANSACTION_FIELD_URL, payload);

        // Validate response
        if (response.status !== 200 && response.status !== 201) {
          throw new Error('Failed to create transaction field');
        }

        if (!response.data.success) {
          throw new Error(response.data.data || 'Failed to create transaction field');
        }

        const fieldData = response.data.message;

        if (!fieldData) {
          throw new Error('No transaction field data returned from server');
        }

        // Transform API response to UI format (usagePooling -> summarization, uom -> unitOfMeasure)
        const apiField = fieldData as unknown as ApiTransactionField;
        const transformedField: TransactionFieldData = {
          ...fieldData,
          id: fieldData.transactionAttribute,
          unitOfMeasure: apiField.uom || apiField.unitOfMeasure || '',
          required: apiField.required === 'Y' || apiField.required === true,
          negativeAllowed: apiField.negativeAllowed === 'Y' || apiField.negativeAllowed === true,
          summarization: apiField.usagePooling === 'Y' || apiField.usagePooling === true,
          accountUsage: apiField.accountUsage === 'Y' || apiField.accountUsage === true,
          calculated: apiField.calculated === 'Y' || apiField.calculated === true
        };

        // Add to local data if available
        if (data) {
          setData([transformedField, ...data]);
          setTotalCount((prev) => prev + 1);
        }

        return transformedField;
      } catch (err) {
        let errorMessage = 'An error occurred while creating transaction field';
        const apiErrorObj: ApiError = {message: errorMessage};

        // Check if it's an axios error with response data
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as {response?: {data?: ErrorResponseData}};
          if (axiosError.response?.data) {
            const errorData = axiosError.response.data;

            // Handle the API error format
            if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
              errorMessage = errorData.details[0]?.message || errorData.message || errorMessage;
              apiErrorObj.message = errorMessage;
              apiErrorObj.details = errorData.details;
            } else if (errorData.message) {
              errorMessage = errorData.message;
              apiErrorObj.message = errorMessage;
            }
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
          apiErrorObj.message = errorMessage;
        }

        const errorObj = new Error(errorMessage);
        setError(errorObj);
        setApiError(apiErrorObj);
        // eslint-disable-next-line no-console
        console.error('Transaction field creation error:', err);

        // Throw the error with the extracted message so caller can handle it immediately
        throw errorObj;
      } finally {
        setIsLoading(false);
      }
    },
    [data]
  );

  /**
   * Update an existing transaction field
   * @param params - Update parameters
   * @returns The updated transaction field
   * @throws Error if update fails
   */
  const updateTransactionField = useCallback(
    async (params: UpdateTransactionFieldParams): Promise<TransactionFieldData> => {
      setIsLoading(true);
      setError(null);
      setApiError(null);

      try {
        // Prepare payload with boolean to Y/N conversion
        const payload = {
          productId: params.productId,
          transactionAttribute: params.transactionAttribute,
          label: params.label,
          dataType: params.dataType,
          uom: params.unitOfMeasure,
          displaySequence: params.displaySequence,
          required: params.required ? 'Y' : 'N',
          negativeAllowed: params.negativeAllowed ? 'Y' : 'N',
          usagePooling: params.summarization ? 'Y' : 'N',
          accountUsage: params.accountUsage ? 'Y' : 'N',
          calculated: params.calculated ? 'Y' : 'N',
          notes: params.notes || ''
        };

        // Make API call
        const response = await axiosClient.put<TransactionFieldResponse>(UPDATE_TRANSACTION_FIELD_URL, payload);

        // Validate response
        if (response.status !== 200) {
          throw new Error('Failed to update transaction field');
        }

        if (!response.data.success) {
          throw new Error(response.data.data || 'Failed to update transaction field');
        }

        const fieldData = response.data.message;

        if (!fieldData) {
          throw new Error('No transaction field data returned from server');
        }

        // Transform API response to UI format (usagePooling -> summarization, uom -> unitOfMeasure)
        const apiField = fieldData as unknown as ApiTransactionField;
        const transformedField: TransactionFieldData = {
          ...fieldData,
          id: fieldData.transactionAttribute,
          unitOfMeasure: apiField.uom || apiField.unitOfMeasure || '',
          required: apiField.required === 'Y' || apiField.required === true,
          negativeAllowed: apiField.negativeAllowed === 'Y' || apiField.negativeAllowed === true,
          summarization: apiField.usagePooling === 'Y' || apiField.usagePooling === true,
          accountUsage: apiField.accountUsage === 'Y' || apiField.accountUsage === true,
          calculated: apiField.calculated === 'Y' || apiField.calculated === true
        };

        // Update local data if available
        if (data) {
          setData(
            data.map((field) => (field.transactionAttribute === params.transactionAttribute ? transformedField : field))
          );
        }

        return transformedField;
      } catch (err) {
        let errorMessage = 'An error occurred while updating transaction field';
        const apiErrorObj: ApiError = {message: errorMessage};

        // Check if it's an axios error with response data
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as {response?: {data?: ErrorResponseData}};
          if (axiosError.response?.data) {
            const errorData = axiosError.response.data;

            // Handle the API error format
            if (errorData.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
              errorMessage = errorData.details[0]?.message || errorData.message || errorMessage;
              apiErrorObj.message = errorMessage;
              apiErrorObj.details = errorData.details;
            } else if (errorData.message) {
              errorMessage = errorData.message;
              apiErrorObj.message = errorMessage;
            }
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
          apiErrorObj.message = errorMessage;
        }

        const errorObj = new Error(errorMessage);
        setError(errorObj);
        setApiError(apiErrorObj);
        // eslint-disable-next-line no-console
        console.error('Transaction field update error:', err);

        // Throw the error with the extracted message so caller can handle it immediately
        throw errorObj;
      } finally {
        setIsLoading(false);
      }
    },
    [data]
  );

  /**
   * Delete a transaction field
   * @param params - Delete parameters
   * @returns true if successful, false otherwise
   */
  const deleteTransactionField = useCallback(
    async (params: DeleteTransactionFieldParams): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const url = `${DELETE_TRANSACTION_FIELD_URL}/${params.productId}/${params.transactionAttribute}`;

        // Make API call with productId and transactionAttribute as path parameters
        const response = await axiosClient.delete<DeleteTransactionFieldResponse>(url);

        // Validate response
        if (response.status !== 200) {
          throw new Error('Failed to delete transaction field');
        }

        if (!response.data.success) {
          throw new Error(response.data.data || 'Failed to delete transaction field');
        }

        // Update local data if available
        if (data) {
          setData(data.filter((field) => field.transactionAttribute !== params.transactionAttribute));
          setTotalCount((prev) => prev - 1);
        }

        return true;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('An error occurred while deleting transaction field');
        setError(errorObj);
        // eslint-disable-next-line no-console
        console.error('Transaction field deletion error:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [data]
  );

  return {
    getTransactionFields,
    createTransactionField,
    updateTransactionField,
    deleteTransactionField,
    isLoading,
    error,
    apiError,
    data,
    totalCount,
    reset
  };
};
