/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';

import axiosClient from '../lib/axios-client';
import {GET_LOOKUP} from '../contants/api';

export const TRANSACTION_ATTRIBUTE_FIELD = 'TRANSACTION_ATTRIBUTE';

export interface TransactionAttributeOption {
  label: string;
  value: string;
}

const lookupResponseSchema = z.object({
  content: z
    .array(
      z.object({
        values: z
          .array(
            z.object({
              id: z.object({
                field: z.string(),
                fieldVal: z.string()
              }),
              displayName: z.string().optional().nullable()
            })
          )
          .optional()
      })
    )
    .optional()
});

/**
 * Custom hook to fetch transaction attribute options from the lookup API
 * Used for populating the transaction attribute dropdown in the transaction field dialog
 *
 * @returns {Object} An object containing:
 *   - transactionAttributeOptions: Array of transaction attribute options with label and value
 *   - loadingTransactionAttributes: Boolean indicating if data is being fetched
 *
 * @example
 * ```tsx
 * const { transactionAttributeOptions, loadingTransactionAttributes } = useTransactionAttributeOptions();
 *
 * <Autocomplete
 *   options={transactionAttributeOptions}
 *   loading={loadingTransactionAttributes}
 *   getOptionLabel={(option) => option.label}
 * />
 * ```
 */
export const useTransactionAttributeOptions = () => {
  const [transactionAttributeOptions, setTransactionAttributeOptions] = React.useState<TransactionAttributeOption[]>(
    []
  );
  const [loadingTransactionAttributes, setLoadingTransactionAttributes] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchTransactionAttributes = async () => {
      setLoadingTransactionAttributes(true);
      try {
        const response = await axiosClient.post(
          GET_LOOKUP,
          {field: TRANSACTION_ATTRIBUTE_FIELD, page: 0, size: 20},
          {signal: controller.signal}
        );

        const parsed = lookupResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error(parsed.error);
          if (mounted) setTransactionAttributeOptions([]);
          return;
        }

        const values = parsed.data.content?.[0]?.values ?? [];
        const options = values.map((v) => ({
          label: v.displayName ?? v.id.fieldVal ?? '',
          value: v.id.fieldVal ?? ''
        }));

        if (mounted) setTransactionAttributeOptions(options);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (controller.signal.aborted) return;
        if (mounted) setTransactionAttributeOptions([]);
      } finally {
        if (mounted) setLoadingTransactionAttributes(false);
      }
    };

    void fetchTransactionAttributes();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return {transactionAttributeOptions, loadingTransactionAttributes};
};
