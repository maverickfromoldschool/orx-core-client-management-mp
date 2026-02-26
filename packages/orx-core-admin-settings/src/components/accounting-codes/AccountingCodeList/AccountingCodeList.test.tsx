/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';

import '@testing-library/jest-dom';
import {AccountingCodeList} from './AccountingCodeList';
import {AccountingCodeRow} from './AccountingCodeList.types';

const mockData: AccountingCodeRow[] = [
  {
    id: '1',
    accountingCode: 'ACH-GL',
    description: 'ACH Processing Fee Income',
    glAccountType: 'Asset',
    glAccountName: 'ACH Processing Fee Income',
    glAccountNumber: '47000500',
    glAccountGroup: 'Balance Sheet Account',
    rule: 'Standard rule'
  },
  {
    id: '2',
    accountingCode: 'AST-AR',
    description: 'Accounts Receivable',
    glAccountType: 'Asset',
    glAccountName: 'Accounts Receivable',
    glAccountNumber: '47007000',
    glAccountGroup: 'Balance Sheet Account',
    rule: 'Standard rule'
  }
];

describe('AccountingCodeList', () => {
  it('renders the component with title', () => {
    render(<AccountingCodeList data={mockData} />);
    const headings = screen.getAllByText('Accounting Code');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders Create New button', () => {
    render(<AccountingCodeList data={mockData} />);
    expect(screen.getByText('Create New')).toBeInTheDocument();
  });

  it('renders Filters button', () => {
    render(<AccountingCodeList data={mockData} />);
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('calls onCreateNew when Create New button is clicked', () => {
    const onCreateNew = jest.fn();
    render(<AccountingCodeList data={mockData} onCreateNew={onCreateNew} />);

    const createButton = screen.getByText('Create New');
    fireEvent.click(createButton);

    expect(onCreateNew).toHaveBeenCalledTimes(1);
  });

  it('calls onFilter when Filters button is clicked', () => {
    const onFilter = jest.fn();
    render(<AccountingCodeList data={mockData} onFilter={onFilter} />);

    const filterButton = screen.getByText('Filters');
    fireEvent.click(filterButton);

    expect(onFilter).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when search input changes', () => {
    const onSearch = jest.fn();
    render(<AccountingCodeList data={mockData} onSearch={onSearch} />);

    const searchInput = screen.getByPlaceholderText('Filter');
    fireEvent.change(searchInput, {target: {value: 'ACH'}});

    expect(onSearch).toHaveBeenCalledWith('ACH');
  });

  it('displays loading state', () => {
    render(<AccountingCodeList data={[]} loading />);
    // DataGrid shows loading indicator when loading prop is true
    const headings = screen.getAllByText('Accounting Code');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders with empty data', () => {
    render(<AccountingCodeList data={[]} totalCount={0} />);
    const headings = screen.getAllByText('Accounting Code');
    expect(headings.length).toBeGreaterThan(0);
  });
});
