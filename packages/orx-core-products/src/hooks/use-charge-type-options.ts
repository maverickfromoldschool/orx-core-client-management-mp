/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';

import axiosClient from '../lib/axios-client';
import {CHARGE_TYPE_FIELD, GET_LOOKUP} from '../contants/api';

export interface ChargeTypeOption {
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

export const useChargeTypeOptions = () => {
  const [chargeTypeOptions, setChargeTypeOptions] = React.useState<ChargeTypeOption[]>([]);
  const [loadingChargeTypes, setLoadingChargeTypes] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchChargeTypes = async () => {
      setLoadingChargeTypes(true);
      try {
        const response = await axiosClient.post(
          GET_LOOKUP,
          {field: CHARGE_TYPE_FIELD, page: 0, size: 10},
          {signal: controller.signal}
        );

        const parsed = lookupResponseSchema.safeParse(response.data);
        if (!parsed.success) {
          // eslint-disable-next-line no-console
          console.error(parsed.error);
          if (mounted) setChargeTypeOptions([]);
          return;
        }

        const values = parsed.data.content?.[0]?.values ?? [];
        const options = values.map((v) => ({label: v.displayName ?? '', value: v.id.fieldVal ?? ''}));

        if (mounted) setChargeTypeOptions(options);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (controller.signal.aborted) return;
        if (mounted) setChargeTypeOptions([]);
      } finally {
        if (mounted) setLoadingChargeTypes(false);
      }
    };

    void fetchChargeTypes();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return {chargeTypeOptions, loadingChargeTypes};
};
