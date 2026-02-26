import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {LookupPage} from './lookup-page';

// Mock the lookup service
jest.mock('../../services', () => ({
  lookupApiService: {
    searchLookupFields: jest.fn().mockResolvedValue({
      fields: [
        {
          id: '1',
          lookupField: 'TEST_FIELD',
          displayName: 'Test Field',
          managedBy: 'User',
          numericValue: true,
          maxStoredValueLength: 100,
          values: []
        }
      ],
      totalElements: 1,
      totalPages: 1
    }),
    createLookupField: jest.fn().mockResolvedValue({
      id: '2',
      lookupField: 'TEST',
      displayName: 'Test',
      managedBy: 'User',
      numericValue: true,
      maxStoredValueLength: 100,
      values: []
    }),
    updateLookupField: jest.fn().mockResolvedValue({
      id: '1',
      lookupField: 'TEST_FIELD',
      displayName: 'Test Field',
      managedBy: 'User',
      numericValue: true,
      maxStoredValueLength: 100,
      values: []
    }),
    deleteLookupField: jest.fn().mockResolvedValue({success: true, message: 'Deleted'})
  }
}));

// Mock the components
jest.mock('../../components', () => ({
  LookupOverviewCard: ({onAdd, onEdit, onDelete}: any) => (
    <div data-testid="lookup-overview-card">
      <button type="button" onClick={onAdd}>
        Add New
      </button>
      <button type="button" onClick={() => onEdit('1')}>
        Edit
      </button>
      <button type="button" onClick={() => onDelete('1')}>
        Delete
      </button>
    </div>
  )
}));

jest.mock('../../lookup-field-dialog', () => ({
  LookupFieldDialog: ({open, onClose, onSave}: any) => (
    <div data-testid="lookup-field-dialog">
      {open && (
        <>
          <button type="button" onClick={onClose}>
            Close Dialog
          </button>
          <button
            type="button"
            onClick={() => onSave({lookupField: 'TEST', displayName: 'Test', managedBy: 'User', numericValue: 'Yes'})}
          >
            Save
          </button>
        </>
      )}
    </div>
  )
}));

describe('LookupPage', () => {
  const renderWithProvider = () =>
    render(
      <NotificationProvider>
        <LookupPage />
      </NotificationProvider>
    );

  it('should render successfully', () => {
    const {baseElement} = renderWithProvider();
    expect(baseElement).toBeTruthy();
  });

  it('should render LookupOverviewCard', () => {
    renderWithProvider();
    expect(screen.getByTestId('lookup-overview-card')).toBeInTheDocument();
  });

  it('should open dialog when Add New is clicked', () => {
    renderWithProvider();

    const addButton = screen.getByText('Add New');
    fireEvent.click(addButton);

    expect(screen.getByText('Close Dialog')).toBeInTheDocument();
  });

  it('should open dialog when Edit is clicked', async () => {
    renderWithProvider();

    // Wait for data to load first
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(screen.getByText('Close Dialog')).toBeInTheDocument();
  });

  it('should close dialog when close is clicked', () => {
    renderWithProvider();

    const addButton = screen.getByText('Add New');
    fireEvent.click(addButton);

    const closeButton = screen.getByText('Close Dialog');
    fireEvent.click(closeButton);

    // Dialog should be closed - close button should not be visible
    expect(screen.queryByText('Close Dialog')).not.toBeInTheDocument();
  });

  it('should handle save from dialog', async () => {
    renderWithProvider();

    const addButton = screen.getByText('Add New');
    fireEvent.click(addButton);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    // Wait for dialog to close after save
    await waitFor(() => {
      expect(screen.queryByText('Close Dialog')).not.toBeInTheDocument();
    });
  });

  it('should handle delete action', () => {
    renderWithProvider();

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    // Should not throw error
    expect(screen.getByTestId('lookup-overview-card')).toBeInTheDocument();
  });
});
