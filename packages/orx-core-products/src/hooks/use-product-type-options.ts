/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';

import axiosClient from '../lib/axios-client';
import {PRODUCT_TYPE_FIELD, GET_LOOKUP} from '../contants/api';

interface ProductTypeOption {
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

export const useProductTypeOptions = () => {
  const [productTypeOptions, setProductTypeOptions] = React.useState<ProductTypeOption[]>([]);
  const [loadingProductTypes, setLoadingProductTypes] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchProductTypes = async () => {
      setLoadingProductTypes(true);
      try {
        const response = await axiosClient.post(
          GET_LOOKUP,
          {field: PRODUCT_TYPE_FIELD, page: 0, size: 50},
          {signal: controller.signal}
        );

        const parsed = lookupResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error(parsed.error);
          if (mounted) setProductTypeOptions([]);
          return;
        }

        const values = parsed.data.content?.[0]?.values ?? [];
        const options = values.map((v) => ({label: v.displayName ?? '', value: v.id.fieldVal ?? ''}));

        if (mounted) setProductTypeOptions(options);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (controller.signal.aborted) return;
        if (mounted) setProductTypeOptions([]);
      } finally {
        if (mounted) setLoadingProductTypes(false);
      }
    };

    void fetchProductTypes();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return {productTypeOptions, loadingProductTypes};
};
