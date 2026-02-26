/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';

import axiosClient from '../lib/axios-client';
import {GET_UOM_URL} from '../contants/api';

interface UomOption {
  label: string;
  value: string;
  unitTypeCd: string;
}

const uomItemSchema = z.object({
  uom: z.string(),
  description: z.string(),
  decimals: z.number().optional(),
  unitTypeCd: z.string().optional(),
  appendToQuantity: z.string().optional(),
  dataType: z.string().nullable().optional()
});

const uomResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    totalPages: z.number(),
    currentPage: z.number(),
    totalRecord: z.number(),
    data: z.array(uomItemSchema)
  }),
  message: z.string().optional()
});

interface UseUomOptionsParams {
  page?: number;
  size?: number;
}

export const useUomOptions = ({page = 0, size = 100}: UseUomOptionsParams = {}) => {
  const [uomOptions, setUomOptions] = React.useState<UomOption[]>([]);
  const [loadingUoms, setLoadingUoms] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchUoms = async () => {
      setLoadingUoms(true);
      try {
        const response = await axiosClient.get(GET_UOM_URL, {
          signal: controller.signal,
          params: {
            page,
            size
          }
        });

        const parsed = uomResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error('UOM response validation error:', parsed.error);
          if (mounted) setUomOptions([]);
          return;
        }

        const uomData = parsed.data.data.data ?? [];
        const options = uomData.map((item) => ({
          label: item.description,
          value: item.uom,
          unitTypeCd: item.unitTypeCd || 'Other'
        }));

        // Sort options by unitTypeCd to ensure proper grouping
        const sortedOptions = options.sort((a, b) => a.unitTypeCd.localeCompare(b.unitTypeCd));

        if (mounted) {
          setUomOptions(sortedOptions);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching UOM options:', error);
        if (controller.signal.aborted) return;
        if (mounted) setUomOptions([]);
      } finally {
        if (mounted) setLoadingUoms(false);
      }
    };

    void fetchUoms();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [page, size]);

  return {
    uomOptions,
    loadingUoms
  };
};
