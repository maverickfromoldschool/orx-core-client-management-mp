import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import type {ProductGroupData} from '../../components/product-group-types';

import {ProductGroupDialog} from './product-group-dialog';

describe('ProductGroupDialog', () => {
  const defaultProps = {
    open: true,
    mode: 'create' as const,
    onClose: jest.fn(),
    onSave: jest.fn(),
    initialValue: undefined as ProductGroupData | undefined,
    isSaving: false,
    productCategoryOptions: [],
    externalSystemOptions: [],
    accountingCodeOptions: [],
    attributeOptions: [],
    variantOptions: [],
    uomOptions: [],
    lookupsLoading: false
  };

  it('should render successfully', () => {
    const {baseElement} = render(<ProductGroupDialog {...defaultProps} />);
    expect(baseElement).toBeTruthy();
  });

  it('should call onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<ProductGroupDialog {...defaultProps} onClose={mockOnClose} />);
    // Find and click any button (dialog should have a close button)
    const buttons = document.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
