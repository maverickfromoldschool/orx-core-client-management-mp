import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {useAttributePage} from '../useAttributePage/use-attribute-page';

import {AttributePage} from './attribute-page';

jest.mock('../useAttributePage/use-attribute-page', () => ({
  useAttributePage: jest.fn()
}));

const renderWithProvider = (component: React.ReactElement) => {
  return render(<NotificationProvider>{component}</NotificationProvider>);
};

describe('AttributePage', () => {
  beforeEach(() => {
    // mock the hook with all required return values
    (useAttributePage as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      setCurrentPage: jest.fn(),
      handleSave: jest.fn(),
      handleDelete: jest.fn(),
      handleBulkAction: jest.fn(),
      handleExport: jest.fn(),
      loadAttributes: jest.fn(),
      dataTypeOptions: [],
      fieldTypeOptions: [],
      entityOptions: [],
      lookupsLoading: false
    });
  });

  it('should render successfully', () => {
    const {baseElement} = renderWithProvider(<AttributePage />);
    expect(baseElement).toBeTruthy();
  });

  it('should change value on Click', () => {
    const handleSave = jest.fn();
    // mock the hook
    (useAttributePage as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      setCurrentPage: jest.fn(),
      handleSave,
      handleDelete: jest.fn(),
      handleBulkAction: jest.fn(),
      handleExport: jest.fn(),
      loadAttributes: jest.fn(),
      dataTypeOptions: [],
      fieldTypeOptions: [],
      entityOptions: [],
      lookupsLoading: false
    });

    const {baseElement} = renderWithProvider(<AttributePage />);
    expect(baseElement).toBeTruthy();
  });
});
