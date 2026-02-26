/* eslint-disable @typescript-eslint/no-floating-promises */
import React from 'react';
import {z} from 'zod';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import axiosClient from '../lib/axios-client';
import {ATTRIBUTE_URL} from '../contants/api';

/**
 * Attribute entity schema
 */
const attributeEntitySchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  id: z.string(),
  attribute: z.string(),
  entity: z.string()
});

/**
 * Attribute value schema
 */
const attributeValueSchema = z.object({
  createdBy: z.string(),
  modifiedBy: z.string(),
  createdDate: z.string(),
  modifiedDate: z.string(),
  version: z.number(),
  attribute: z.string(),
  attributeValue: z.string(),
  description: z.string()
});

/**
 * Attribute detail schema
 */
const attributeDetailSchema = z.object({
  createdBy: z.string().optional().nullable(),
  modifiedBy: z.string().optional().nullable(),
  createdDate: z.string().optional().nullable(),
  modifiedDate: z.string().optional().nullable(),
  version: z.number(),
  attribute: z.string(),
  description: z.string(),
  dataType: z.string(),
  required: z.string(),
  systemDefinedLookup: z.string(),
  predefinedSw: z.string(),
  attributeEntity: z.array(attributeEntitySchema),
  attributeValues: z.array(attributeValueSchema),
  notes: z.string().nullable(),
  entity: z.string().nullable(),
  unitOfMeasure: z.string().nullable(),
  predefinedFieldType: z.string().nullable(),
  predefinedField: z.string().nullable()
});

/**
 * Get attribute response schema
 */
const getAttributeResponseSchema = z.object({
  success: z.boolean(),
  data: attributeDetailSchema,
  message: z.string()
});

/**
 * Attribute entity type
 */
export type AttributeEntity = z.infer<typeof attributeEntitySchema>;

/**
 * Attribute value type
 */
export type AttributeValue = z.infer<typeof attributeValueSchema>;

/**
 * Attribute detail type
 */
export type AttributeDetail = z.infer<typeof attributeDetailSchema>;

/**
 * Return type for useGetAttribute hook
 */
export interface UseGetAttributeReturn {
  isLoading: boolean;
  error: Error | null;
  fetchAttribute: (attributeCode: string) => Promise<AttributeDetail | null>;
  refetch: () => Promise<AttributeDetail | null>;
  reset: () => void;
}

/**
 * Custom hook for fetching an attribute by code
 * @returns {UseGetAttributeReturn} Hook state and fetch functions
 *
 * @example
 * ```tsx
 * const { fetchAttribute, isLoading, error } = useGetAttribute();
 *
 * // Fetch attribute data - returns the data
 * const attributeData = await fetchAttribute('PRDINVCAT');
 * ```
 */
export const useGetAttribute = (): UseGetAttributeReturn => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [lastAttributeCode, setLastAttributeCode] = React.useState<string | undefined>(undefined);
  const {showError} = useNotification();

  /**
   * Fetches attribute data from the API
   */
  const fetchAttribute = React.useCallback(
    async (code: string): Promise<AttributeDetail | null> => {
      if (!code || code.trim() === '') {
        const validationError = new Error('Attribute code is required');
        setError(validationError);
        showError('Attribute code is required');

        return null;
      }

      setIsLoading(true);
      setError(null);
      setLastAttributeCode(code);

      try {
        const response = await axiosClient.get(`${ATTRIBUTE_URL}/${code}`);

        // Validate response structure
        const validatedData = getAttributeResponseSchema.parse(response.data);

        if (!validatedData.success) {
          throw new Error(validatedData.message || 'Failed to fetch attribute');
        }

        return validatedData.data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching attribute';
        const fetchError = new Error(errorMessage);

        setError(fetchError);
        showError(errorMessage);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  /**
   * Refetches the last attribute that was requested
   */
  const refetch = React.useCallback(async (): Promise<AttributeDetail | null> => {
    if (lastAttributeCode) {
      return await fetchAttribute(lastAttributeCode);
    }

    return null;
  }, [lastAttributeCode, fetchAttribute]);

  /**
   * Resets the hook state to initial values
   */
  const reset = React.useCallback(() => {
    setIsLoading(false);
    setError(null);
    setLastAttributeCode(undefined);
  }, []);

  return {
    isLoading,
    error,
    fetchAttribute,
    refetch,
    reset
  };
};
