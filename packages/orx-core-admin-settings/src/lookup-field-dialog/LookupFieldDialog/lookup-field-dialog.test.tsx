import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';

import {LookupFieldDialog} from './lookup-field-dialog';
import type {LookupFieldData} from './lookup-field-dialog.types';

describe('LookupFieldDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    isSaving: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dialog in add mode', () => {
    render(<LookupFieldDialog {...defaultProps} />);

    expect(screen.getByText('Add New Lookup Field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter lookup field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter display name')).toBeInTheDocument();
  });

  it('should render dialog in edit mode with initial data', () => {
    const initialData: LookupFieldData = {
      lookupField: 'FIELD_001',
      displayName: 'Test Field',
      maxStoredValueLength: '50',
      managedBy: 'User',
      numericValue: true
    };

    render(<LookupFieldDialog {...defaultProps} initialData={initialData} />);

    expect(screen.getByText('Edit Lookup Field')).toBeInTheDocument();
    expect(screen.getByDisplayValue('FIELD_001')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Field')).toBeInTheDocument();
  });

  it('should handle form input changes', () => {
    render(<LookupFieldDialog {...defaultProps} />);

    const lookupFieldInput = screen.getByPlaceholderText('Enter lookup field');
    const displayNameInput = screen.getByPlaceholderText('Enter display name');

    fireEvent.change(lookupFieldInput, {target: {value: 'NEW_FIELD'}});
    fireEvent.change(displayNameInput, {target: {value: 'New Display Name'}});

    expect(lookupFieldInput).toHaveValue('NEW_FIELD');
    expect(displayNameInput).toHaveValue('New Display Name');
  });

  it('should validate required fields on submit', async () => {
    render(<LookupFieldDialog {...defaultProps} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Lookup field is required')).toBeInTheDocument();
      expect(screen.getByText('Display name is required')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onSave with form data when valid', async () => {
    render(<LookupFieldDialog {...defaultProps} />);

    const lookupFieldInput = screen.getByPlaceholderText('Enter lookup field');
    const displayNameInput = screen.getByPlaceholderText('Enter display name');
    const maxLengthInput = screen.getByPlaceholderText('Enter max length');

    fireEvent.change(lookupFieldInput, {target: {value: 'FIELD_001'}});
    fireEvent.change(displayNameInput, {target: {value: 'Test Field'}});
    fireEvent.change(maxLengthInput, {target: {value: '50'}});

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(
        expect.objectContaining({
          lookupField: 'FIELD_001',
          displayName: 'Test Field',
          maxStoredValueLength: '50',
          numericValue: false
        })
      );
    });
  });

  it('should display managed by chip in edit mode', () => {
    const initialData: LookupFieldData = {
      lookupField: 'FIELD_001',
      displayName: 'Test Field',
      maxStoredValueLength: '50',
      managedBy: 'User',
      numericValue: false
    };

    render(<LookupFieldDialog {...defaultProps} initialData={initialData} />);

    expect(screen.getByText('User Managed')).toBeInTheDocument();
  });

  it('should handle numeric value switch changes', () => {
    render(<LookupFieldDialog {...defaultProps} />);

    const numericSwitch = screen.getByRole('checkbox');

    // Initially should show 'No'
    expect(screen.getByText('No')).toBeInTheDocument();

    // Click the switch
    fireEvent.click(numericSwitch);

    // Should now show 'Yes'
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', () => {
    render(<LookupFieldDialog {...defaultProps} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should call onClose when close icon is clicked', () => {
    render(<LookupFieldDialog {...defaultProps} />);

    const closeButton = screen.getByRole('button', {name: ''});
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should disable buttons when saving', () => {
    render(<LookupFieldDialog {...defaultProps} isSaving />);

    const saveButton = screen.getByText('Saving...');
    const cancelButton = screen.getByText('Cancel');

    expect(saveButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it('should not close when saving', () => {
    render(<LookupFieldDialog {...defaultProps} isSaving />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should clear errors when user starts typing after validation error', async () => {
    render(<LookupFieldDialog {...defaultProps} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Lookup field is required')).toBeInTheDocument();
    });

    const lookupFieldInput = screen.getByPlaceholderText('Enter lookup field');
    fireEvent.change(lookupFieldInput, {target: {value: 'FIELD_001'}});

    await waitFor(() => {
      expect(screen.queryByText('Lookup field is required')).not.toBeInTheDocument();
    });
  });

  it('should reset form when dialog closes', () => {
    const {rerender} = render(<LookupFieldDialog {...defaultProps} />);

    const lookupFieldInput = screen.getByPlaceholderText('Enter lookup field');
    fireEvent.change(lookupFieldInput, {target: {value: 'TEST'}});

    rerender(<LookupFieldDialog {...defaultProps} open={false} />);
    rerender(<LookupFieldDialog {...defaultProps} open />);

    expect(screen.getByPlaceholderText('Enter lookup field')).toHaveValue('');
  });
});
