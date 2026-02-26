import React from 'react';

import {ApiConfig} from '../../types/api-accounting-code-config.types';
import {ApiProvider} from '../../contexts/api-context';

import {AccountingCodePage} from './accounting-code-page';

export function AccountingCodePageWrapper() {
  const apiConfig: ApiConfig = {
    endpoints: {
      getAccountingCodes: '/admin/v1/accounting-code',
      getAccountingCodesListV1: '/admin/v1/accounting-code',
      getAccountingCodeV1: '/admin/v1/accounting-code/:accountingCode',
      createAccountingCode: '/admin/v1/accounting-code',
      updateAccountingCode: '/admin/v1/accounting-code/:id',
      deleteAccountingCode: '/admin/v1/accounting-code/:id',
      createAccountingCodeV1: '/admin/v1/accounting-code',
      updateAccountingCodeV1: '/admin/v1/accounting-code'
    }
  };

  return (
    <ApiProvider config={apiConfig}>
      <AccountingCodePage />
    </ApiProvider>
  );
}
