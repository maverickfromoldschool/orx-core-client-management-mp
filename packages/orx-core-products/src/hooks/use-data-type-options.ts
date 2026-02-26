/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';

import axiosClient from '../lib/axios-client';
import {GET_LOOKUP} from '../contants/api';

export const DATA_TYPE_FIELD = 'DATA_TYPE';

export interface DataTypeOption {
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
 * Custom hook to fetch data type options from the lookup API
 * Used for populating the data type dropdown in the transaction field dialog
 *
 * @returns {Object} An object containing:
 *   - dataTypeOptions: Array of data type options with label and value
 *   - loadingDataTypes: Boolean indicating if data is being fetched
 *
 * @example
 * ```tsx
 * const { dataTypeOptions, loadingDataTypes } = useDataTypeOptions();
 *
 * <Autocomplete
 *   options={dataTypeOptions}
 *   loading={loadingDataTypes}
 *   getOptionLabel={(option) => option.label}
 * />
 * ```
 */
export const useDataTypeOptions = () => {
  const [dataTypeOptions, setDataTypeOptions] = React.useState<DataTypeOption[]>([]);
  const [loadingDataTypes, setLoadingDataTypes] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchDataTypes = async () => {
      setLoadingDataTypes(true);
      try {
        const response = await axiosClient.post(
          GET_LOOKUP,
          {field: DATA_TYPE_FIELD, page: 0, size: 20},
          {signal: controller.signal}
        );

        const parsed = lookupResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error(parsed.error);
          if (mounted) setDataTypeOptions([]);
          return;
        }

        const values = parsed.data.content?.[0]?.values ?? [];
        const options = values.map((v) => ({
          label: v.displayName ?? v.id.fieldVal ?? '',
          value: v.id.fieldVal ?? ''
        }));

        if (mounted) setDataTypeOptions(options);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (controller.signal.aborted) return;
        if (mounted) setDataTypeOptions([]);
      } finally {
        if (mounted) setLoadingDataTypes(false);
      }
    };

    void fetchDataTypes();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return {dataTypeOptions, loadingDataTypes};
};
