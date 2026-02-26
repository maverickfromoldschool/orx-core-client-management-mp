import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {ApiProvider} from '../../contexts/api-context';

import {AccountingCodePage} from './accounting-code-page';

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
    createAccountingCodeV1: '/v1/accounting-code',
    updateAccountingCodeV1: '/v1/accounting-code',
    getAccountingCodesListV1: '/v1/accounting-code',
    getAccountingCodeV1: '/v1/accounting-code'
  }
};

describe('AccountingCodePage', () => {
  it('should render successfully', () => {
    const {baseElement} = render(
      <NotificationProvider>
        <ApiProvider config={mockConfig}>
          <AccountingCodePage />
        </ApiProvider>
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
