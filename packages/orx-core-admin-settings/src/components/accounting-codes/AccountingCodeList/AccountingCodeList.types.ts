export interface AccountingCodeRow {
  id: string;
  accountingCode: string;
  description: string;
  glAccountType: string;
  glAccountName: string;
  glAccountNumber: string;
  glAccountGroup: string;
  rule?: string;
}

export interface FilterValues {
  accountingCode: string;
  description: string;
  glAccountType: string;
  glAccountName: string;
  glAccountNumber: string;
  glAccountGroup: string;
}

export interface AccountingCodeListProps {
  /**
   * Array of accounting code data to display
   */
  data?: AccountingCodeRow[];

  /**
   * Loading state for the table
   */
  loading?: boolean;

  /**
   * Total count of items for pagination
   */
  totalCount?: number;

  /**
   * Current page number (0-indexed)
   */
  page?: number;

  /**
   * Number of items per page
   */
  pageSize?: number;

  /**
   * Callback when Create New button is clicked
   */
  onCreateNew?: () => void;

  /**
   * Callback when edit action is triggered
   */
  onEdit?: (row: AccountingCodeRow) => void;

  /**
   * Callback when delete action is triggered
   */
  onDelete?: (row: AccountingCodeRow) => void;

  /**
   * Callback when filter button is clicked
   */
  onFilter?: () => void;

  /**
   * Callback when filters are applied
   */
  onFilterApply?: (filters: FilterValues) => void;

  /**
   * Callback when search value changes
   */
  onSearch?: (value: string) => void;

  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;

  /**
   * Callback when page size changes
   */
  onPageSizeChange?: (pageSize: number) => void;

  /**
   * GL Account Type dropdown options for rendering labels
   */
  glAccountTypes?: {value: string; label: string}[];

  /**
   * GL Account Group dropdown options for rendering labels
   */
  glAccountGroups?: {value: string; label: string}[];

  /**
   * GL Accounting Key Plugin dropdown options for rendering labels
   */
  glAccountingKeyPlugins?: {value: string; label: string}[];
}
