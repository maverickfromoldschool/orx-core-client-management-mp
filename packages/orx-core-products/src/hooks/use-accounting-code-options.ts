/* eslint-disable no-await-in-loop */
/* eslint-disable no-void */
import React from 'react';
import {z} from 'zod';

import axiosClient from '../lib/axios-client';
import {ACCOUNTING_CODE_URL} from '../contants/api';

interface AccountingCodeOption {
  label: string;
  value: string;
}

const accountingCodeResponseSchema = z.object({
  data: z.object({
    totalPages: z.number(),
    currentPage: z.number(),
    totalRecord: z.number(),
    data: z.array(
      z.object({
        accountingCode: z.string(),
        description: z.string()
      })
    )
  })
});

export const useAccountingCodeOptions = () => {
  const [accountingCodeOptions, setAccountingCodeOptions] = React.useState<AccountingCodeOption[]>([]);
  const [loadingAccountingCodes, setLoadingAccountingCodes] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchAccountingCodes = async () => {
      setLoadingAccountingCodes(true);
      try {
        const allOptions: AccountingCodeOption[] = [];
        let currentPage = 0;
        let totalPages = 1;

        // Fetch all pages
        while (currentPage < totalPages) {
          const response = await axiosClient.get(ACCOUNTING_CODE_URL, {
            params: {page: currentPage},
            signal: controller.signal
          });

          const parsed = accountingCodeResponseSchema.safeParse(response.data);
          if (!parsed.success) {
            // eslint-disable-next-line no-console
            console.error(parsed.error);
            if (mounted) setAccountingCodeOptions([]);
            return;
          }

          const {data, totalPages: total} = parsed.data.data;
          totalPages = total;

          const options = data.map((code) => ({
            label: code.description,
            value: code.accountingCode
          }));

          allOptions.push(...options);
          currentPage += 1;
        }

        if (mounted) setAccountingCodeOptions(allOptions);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        if (controller.signal.aborted) return;
        if (mounted) setAccountingCodeOptions([]);
      } finally {
        if (mounted) setLoadingAccountingCodes(false);
      }
    };

    void fetchAccountingCodes();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return {accountingCodeOptions, loadingAccountingCodes};
};
