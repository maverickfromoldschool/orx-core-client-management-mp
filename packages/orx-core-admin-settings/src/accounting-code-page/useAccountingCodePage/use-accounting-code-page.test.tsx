// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import {renderHook} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {ApiProvider} from '../../contexts/api-context';

import {useAccountingCodePage} from './use-accounting-code-page';

const mockConfig = {
  baseUrl: 'https://test-api.com',
  headers: {},
  endpoints: {
    getAccountingCodes: '/api/accounting-codes',
    createAccountingCode: '/api/accounting-codes',
    updateAccountingCode: '/api/accounting-codes',
    deleteAccountingCode: '/api/accounting-codes',
    getGlAccountTypes: '/api/gl-account-types',
    getGlAccountGroups: '/api/gl-account-groups',
    searchLookup: '/api/lookups/search',
    createAccountingCodeV1: '/v1/accounting-code',
    updateAccountingCodeV1: '/v1/accounting-code',
    getAccountingCodesListV1: '/v1/accounting-code',
    getAccountingCodeV1: '/v1/accounting-code'
  }
};

const wrapper = ({children}: {children: React.ReactNode}) => (
  <NotificationProvider>
    <ApiProvider config={mockConfig}>{children}</ApiProvider>
  </NotificationProvider>
);

describe('useAccountingCodePage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useAccountingCodePage(), {wrapper});

    expect(result.current).toBeTruthy();
  });
});
