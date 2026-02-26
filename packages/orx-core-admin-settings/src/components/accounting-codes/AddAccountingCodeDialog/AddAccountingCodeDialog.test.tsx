/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {AddAccountingCodeDialog} from './AddAccountingCodeDialog';
import {AddAccountingCodeFormData} from './AddAccountingCodeDialog.types';

describe('AddAccountingCodeDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    glAccountTypes: [
      {value: 'asset', label: 'Asset'},
      {value: 'liability', label: 'Liability'}
    ],
    glAccountGroups: [
      {value: 'group1', label: 'Group 1'},
      {value: 'group2', label: 'Group 2'}
    ],
    glAccountingKeyPlugins: [{value: 'plugin1', label: 'Plugin 1'}]
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dialog when open is true', () => {
    render(<AddAccountingCodeDialog {...defaultProps} />);
    expect(screen.getByText('Add Accounting Code')).toBeInTheDocument();
  });

  it('does not render the dialog when open is false', () => {
    render(<AddAccountingCodeDialog {...defaultProps} open={false} />);
    expect(screen.queryByText('Add Accounting Code')).not.toBeInTheDocument();
  });

  it('displays all three tabs', () => {
    render(<AddAccountingCodeDialog {...defaultProps} />);
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByText('GL Account Number')).toBeInTheDocument();
    expect(screen.getByText('Notes')).toBeInTheDocument();
  });

  it('switches between tabs when clicked', async () => {
    render(<AddAccountingCodeDialog {...defaultProps} />);

    // Click on GL Account Number tab
    const glAccountTab = screen.getByText('GL Account Number');
    fireEvent.click(glAccountTab);

    await waitFor(() => {
      expect(screen.getByText('Add Account Number')).toBeInTheDocument();
    });

    // Click on Notes tab
    const notesTab = screen.getByText('Notes');
    fireEvent.click(notesTab);

    await waitFor(() => {
      expect(screen.getByText('Please describe the behavior of the accounting code in context')).toBeInTheDocument();
    });
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<AddAccountingCodeDialog {...defaultProps} />);
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close icon is clicked', () => {
    render(<AddAccountingCodeDialog {...defaultProps} />);
    const closeButton = screen.getByRole('button', {name: ''});
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('displays validation errors for required fields', async () => {
    render(<AddAccountingCodeDialog {...defaultProps} />);

    // Try to submit without filling required fields
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Accounting Code is required')).toBeInTheDocument();
    });
  });

  it('shows character count for text fields', () => {
    render(<AddAccountingCodeDialog {...defaultProps} />);
    expect(screen.getByText('0 / 30')).toBeInTheDocument(); // Accounting Code
    expect(screen.getByText('0 / 50')).toBeInTheDocument(); // Name
    expect(screen.getByText('0 / 254')).toBeInTheDocument(); // GL Account Name
  });

  it('populates form with initial data when provided', () => {
    const initialData: Partial<AddAccountingCodeFormData> = {
      accountingCode: 'AC-001',
      name: 'Test Account',
      glAccountType: 'asset',
      glAccountName: 'Test GL Account',
      displaySequence: 5,
      glAccountGroup: 'group1'
    };

    render(<AddAccountingCodeDialog {...defaultProps} initialData={initialData} />);

    expect(screen.getByDisplayValue('AC-001')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Account')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test GL Account')).toBeInTheDocument();
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  it('disables Save button when loading is true', () => {
    render(<AddAccountingCodeDialog {...defaultProps} loading />);
    const saveButton = screen.getByText('Saving...');
    expect(saveButton).toBeDisabled();
  });

  it('displays empty state in GL Account Number tab', () => {
    render(<AddAccountingCodeDialog {...defaultProps} />);

    // Switch to GL Account Number tab
    const glAccountTab = screen.getByText('GL Account Number');
    fireEvent.click(glAccountTab);

    expect(screen.getByText('No account number added for GL account number history.')).toBeInTheDocument();
  });

  it('updates character count as user types in Notes tab', async () => {
    const user = userEvent.setup();
    render(<AddAccountingCodeDialog {...defaultProps} />);

    // Switch to Notes tab
    const notesTab = screen.getByText('Notes');
    fireEvent.click(notesTab);

    // Type in the notes field
    const notesField = screen.getByPlaceholderText('Enter notes here...');
    await user.type(notesField, 'Test note');

    await waitFor(() => {
      expect(screen.getByText('9 / 1000')).toBeInTheDocument();
    });
  });
});
