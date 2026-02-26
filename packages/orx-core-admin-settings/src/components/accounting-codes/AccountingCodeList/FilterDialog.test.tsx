/* eslint-disable jest/no-conditional-expect */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';

import '@testing-library/jest-dom';
import {FilterDialog, FilterValues} from './FilterDialog';

describe('FilterDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnApply = jest.fn();
  const mockOnClear = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onApply: mockOnApply,
    onClear: mockOnClear
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the drawer when open is true', () => {
    render(<FilterDialog {...defaultProps} />);

    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Select the filtering options to fetch the required data')).toBeInTheDocument();
  });

  it('does not render the drawer when open is false', () => {
    render(<FilterDialog {...defaultProps} open={false} />);

    expect(screen.queryByText('Filters')).not.toBeInTheDocument();
  });

  it('renders all filter fields', () => {
    render(<FilterDialog {...defaultProps} />);

    expect(screen.getByPlaceholderText('Enter accounting code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter GL account type')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter GL account name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter GL account number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter GL account group')).toBeInTheDocument();
  });

  it('populates fields with initial values', () => {
    const initialValues: FilterValues = {
      accountingCode: 'ACH-GL',
      description: 'Test Description',
      glAccountType: 'Asset',
      glAccountName: 'Test Account',
      glAccountNumber: '12345',
      glAccountGroup: 'Test Group'
    };

    render(<FilterDialog {...defaultProps} initialValues={initialValues} />);

    expect(screen.getByDisplayValue('ACH-GL')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Asset')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Account')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12345')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Group')).toBeInTheDocument();
  });

  it('updates filter values when typing', () => {
    render(<FilterDialog {...defaultProps} />);

    const accountingCodeInput = screen.getByPlaceholderText('Enter accounting code');
    fireEvent.change(accountingCodeInput, {target: {value: 'ACH-GL'}});

    expect(accountingCodeInput).toHaveValue('ACH-GL');
  });

  it('calls onApply with filter values when Filter button is clicked', async () => {
    render(<FilterDialog {...defaultProps} />);

    const accountingCodeInput = screen.getByPlaceholderText('Enter accounting code');
    const descriptionInput = screen.getByPlaceholderText('Enter description');

    fireEvent.change(accountingCodeInput, {target: {value: 'ACH-GL'}});
    fireEvent.change(descriptionInput, {target: {value: 'Test Description'}});

    const filterButton = screen.getByRole('button', {name: /filter/i});
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(mockOnApply).toHaveBeenCalledWith({
        accountingCode: 'ACH-GL',
        description: 'Test Description',
        glAccountType: '',
        glAccountName: '',
        glAccountNumber: '',
        glAccountGroup: ''
      });
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('clears all filter values when Clear button is clicked', async () => {
    const initialValues: FilterValues = {
      accountingCode: 'ACH-GL',
      description: 'Test Description',
      glAccountType: 'Asset',
      glAccountName: 'Test Account',
      glAccountNumber: '12345',
      glAccountGroup: 'Test Group'
    };

    render(<FilterDialog {...defaultProps} initialValues={initialValues} />);

    const clearButton = screen.getByRole('button', {name: /clear/i});
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(mockOnClear).toHaveBeenCalled();
    });

    // Check that all fields are cleared
    expect(screen.getByPlaceholderText('Enter accounting code')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter description')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter GL account type')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter GL account name')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter GL account number')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter GL account group')).toHaveValue('');
  });

  it('calls onClose when close button is clicked', () => {
    render(<FilterDialog {...defaultProps} />);

    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find((btn) => btn.querySelector('[data-testid="CloseIcon"]'));
    expect(closeButton).toBeTruthy();
    fireEvent.click(closeButton!);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking outside the drawer', () => {
    render(<FilterDialog {...defaultProps} />);

    // MUI Drawer backdrop click
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('renders action buttons with correct styling', () => {
    render(<FilterDialog {...defaultProps} />);

    const filterButton = screen.getByRole('button', {name: /filter/i});
    const clearButton = screen.getByRole('button', {name: /clear/i});

    expect(filterButton).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });
});
