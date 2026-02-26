import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, waitFor} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import * as billCycleService from '../../services/bill-cycle.service';

import {BillCyclePage} from './bill-cycle-page';

// Mock the bill cycle service
jest.mock('../../services/bill-cycle.service');

describe('BillCyclePage', () => {
  beforeEach(() => {
    // Mock the API service methods
    jest.spyOn(billCycleService.billCycleApiService, 'getBillCycles').mockResolvedValue({
      billCycles: [],
      count: 0
    });
    jest.spyOn(billCycleService.billCycleApiService, 'getBillPeriodTypes').mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render successfully', async () => {
    const {baseElement} = render(
      <NotificationProvider>
        <BillCyclePage />
      </NotificationProvider>
    );

    // Wait for async operations to complete
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
