import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {useProductGroup} from '../useProductGroup/use-product-group';

import {ProductGroup} from './product-group';

jest.mock('../useProductGroup/use-product-group', () => ({
  useProductGroup: jest.fn()
}));

describe('ProductGroup', () => {
  it('should render successfully', () => {
    // mock the hook
    (useProductGroup as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      itemsPerPage: 10,
      setCurrentPage: jest.fn(),
      setItemsPerPage: jest.fn(),
      handleSave: jest.fn(),
      handleDelete: jest.fn(),
      handleBulkAction: jest.fn(),
      handleExport: jest.fn(),
      loadProductGroups: jest.fn(),
      productCategoryOptions: [],
      externalSystemOptions: [],
      accountingCodeOptions: [],
      attributeOptions: [],
      variantOptions: [],
      lookupsLoading: false
    });

    const {baseElement} = render(
      <NotificationProvider>
        <ProductGroup />
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should handle interactions', () => {
    const mockLoadProductGroups = jest.fn();
    // mock the hook
    (useProductGroup as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      totalElements: 0,
      totalPages: 0,
      currentPage: 0,
      itemsPerPage: 10,
      setCurrentPage: jest.fn(),
      setItemsPerPage: jest.fn(),
      handleSave: jest.fn(),
      handleDelete: jest.fn(),
      handleBulkAction: jest.fn(),
      handleExport: jest.fn(),
      loadProductGroups: mockLoadProductGroups,
      productCategoryOptions: [],
      externalSystemOptions: [],
      accountingCodeOptions: [],
      attributeOptions: [],
      variantOptions: [],
      lookupsLoading: false
    });

    const {baseElement} = render(
      <NotificationProvider>
        <ProductGroup />
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
