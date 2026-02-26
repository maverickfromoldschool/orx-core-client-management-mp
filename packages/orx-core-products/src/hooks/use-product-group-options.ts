/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';

import axiosClient from '../lib/axios-client';
import {PRODUCT_GROUP_URL} from '../contants/api';

interface ProductGroupOption {
  label: string;
  value: string;
}

const productGroupResponseSchema = z.object({
  data: z
    .object({
      data: z
        .array(
          z.object({
            productGroup: z.string().optional().nullable(),
            name: z.string().optional().nullable()
          })
        )
        .optional()
    })
    .optional()
});

export const useProductGroupOptions = () => {
  const [productGroupOptions, setProductGroupOptions] = React.useState<ProductGroupOption[]>([]);
  const [loadingProductGroups, setLoadingProductGroups] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchProductGroups = async () => {
      setLoadingProductGroups(true);
      try {
        const response = await axiosClient.get(PRODUCT_GROUP_URL, {signal: controller.signal});

        const parsed = productGroupResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error(parsed.error);
          if (mounted) setProductGroupOptions([]);
          return;
        }

        const groups = parsed.data.data?.data ?? [];
        const options = groups
          .map((group) => ({
            label: group.name ?? '',
            value: group.productGroup ?? ''
          }))
          .filter((option) => option.label && option.value);

        if (mounted) setProductGroupOptions(options);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (controller.signal.aborted) return;
        if (mounted) setProductGroupOptions([]);
      } finally {
        if (mounted) setLoadingProductGroups(false);
      }
    };

    void fetchProductGroups();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return {productGroupOptions, loadingProductGroups};
};
