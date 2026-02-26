import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, fireEvent} from '@testing-library/react';

import {useTableRecordDialog} from '../useTableRecordDialog/use-table-record-dialog';

import {TableRecordDialog} from './table-record-dialog';
import {TableRecordDialogProps} from './table-record-dialog.types';

jest.mock('../useTableRecordDialog/use-table-record-dialog', () => ({
  useTableRecordDialog: jest.fn()
}));

describe('TableRecordDialog', () => {
  it('should render successfully', () => {
    // mock the hook to return rows
    (useTableRecordDialog as jest.Mock).mockReturnValue({
      rows: [{id: 1, name: 'Test', col: 'test value', description: 'detail text'}],
      loading: false,
      error: null,
      refresh: jest.fn()
    });

    const props: TableRecordDialogProps = {
      title: 'Test Title',
      fields: [{label: 'Col', value: 'col'}]
    };

    const {baseElement, getByText} = render(<TableRecordDialog {...props} />);
    expect(baseElement).toBeTruthy();
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('test value')).toBeTruthy();
  });

  it('should change value on Click', async () => {
    // mock the hook
    (useTableRecordDialog as jest.Mock).mockReturnValue({
      rows: [{id: 1, name: 'Test', col: 'test value', description: 'detail text'}],
      loading: false,
      error: null,
      refresh: jest.fn()
    });

    const props2: TableRecordDialogProps = {
      title: 'Test Title',
      fields: [{label: 'Col', value: 'col'}]
    };

    const {getByText, findByText} = render(<TableRecordDialog {...props2} />);
    // click More Details to expand
    const more = getByText('More Details');
    fireEvent.click(more);
    // details are rendered synchronously in this component, but use findByText to be safe
    const detail = await findByText('detail text');
    expect(detail).toBeTruthy();
  });
});
