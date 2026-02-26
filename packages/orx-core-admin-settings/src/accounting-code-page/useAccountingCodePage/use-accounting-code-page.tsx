/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {useEffect, useState, useCallback} from 'react';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {useApiService} from '../../contexts/api-context';
import {AccountingCodeRow} from '../../components/accounting-codes/AccountingCodeList';
import {AddAccountingCodeFormData} from '../../components/accounting-codes/AddAccountingCodeDialog';
import {EditAccountingCodeFormData} from '../../components/accounting-codes/EditAccountingCodeDialog';
import {FilterValues} from '../../components/accounting-codes/AccountingCodeList/FilterDialog';

interface AccountingCodeEntryDetail {
  glAccountNumber: string;
  effectiveDate: string;
  expiryDate?: string | null;
}

interface AccountingCodeDetail {
  accountingCode: string;
  description: string;
  glAccountType: string;
  glAccountName: string;
  displaySequence: string;
  glAccountGroup: string;
  glRulePlugin: string;
  accountingCodeEntries?: AccountingCodeEntryDetail[];
  notes?: string;
}

const isAccountingCodeDetail = (value: unknown): value is AccountingCodeDetail => {
  return typeof value === 'object' && value !== null && 'accountingCode' in value;
};

interface DropdownOption {
  value: string;
  label: string;
}

export function useAccountingCodePage() {
  const apiService = useApiService();
  const {showSuccess, showError} = useNotification();

  // Data state
  const [data, setData] = useState<AccountingCodeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDialogLoading, setEditDialogLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // Selected data state
  const [selectedRow, setSelectedRow] = useState<AccountingCodeRow | null>(null);
  const [editFormData, setEditFormData] = useState<EditAccountingCodeFormData | null>(null);
  const [rowToDelete, setRowToDelete] = useState<AccountingCodeRow | null>(null);

  // Filter state
  const [filterValues, setFilterValues] = useState<FilterValues>({
    accountingCode: '',
    description: '',
    glAccountType: '',
    glAccountName: '',
    glAccountNumber: '',
    glAccountGroup: ''
  });

  // Dropdown data state
  const [glAccountTypes, setGlAccountTypes] = useState<DropdownOption[]>([
    {value: 'AST', label: 'Asset'},
    {value: 'BDT', label: 'Bad Debt'},
    {value: 'CSH', label: 'Cash'},
    {value: 'DIS', label: 'Discounts'},
    {value: 'EQY', label: 'Equity'},
    {value: 'EXP', label: 'Expenses'},
    {value: 'LIB', label: 'Liability'},
    {value: 'REV', label: 'Revenue'},
    {value: 'TAX', label: 'Taxes'}
  ]);

  const [glAccountGroups, setGlAccountGroups] = useState<DropdownOption[]>([
    {value: 'BSA', label: 'Balance Sheet Account'},
    {value: 'PAL', label: 'Profit & Loss Statement Account'}
  ]);

  const [glAccountingKeyPlugins, setGlAccountingKeyPlugins] = useState<DropdownOption[]>([
    {value: 'GLA', label: 'Sample GL String Derrivation'}
  ]);

  // Utility function
  const formatLocalDateTime = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00`;
  }, []);

  // Fetch dropdown data on mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [types, groups, plugins] = await Promise.allSettled([
          apiService.getGlAccountTypes().catch(() => null),
          apiService.getGlAccountGroups().catch(() => null),
          apiService.getGlAccountingKeyPlugins().catch(() => null)
        ]);

        if (types.status === 'fulfilled' && types.value) {
          setGlAccountTypes(types.value);
        }
        if (groups.status === 'fulfilled' && groups.value) {
          setGlAccountGroups(groups.value);
        }
        if (plugins.status === 'fulfilled' && plugins.value) {
          setGlAccountingKeyPlugins(plugins.value);
        }
      } catch {
        // Failed to fetch dropdown data, using defaults
      }
    };

    fetchDropdownData();
  }, [apiService]);

  // Fetch accounting codes data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.getAccountingCodesListV1({
          page,
          size: pageSize,
          search: searchTerm || undefined,
          accountingCode: filterValues.accountingCode || undefined,
          description: filterValues.description || undefined,
          glAccountType: filterValues.glAccountType || undefined,
          glAccountName: filterValues.glAccountName || undefined,
          glAccountNumber: filterValues.glAccountNumber || undefined,
          glAccountGroup: filterValues.glAccountGroup || undefined
        });

        const rows: AccountingCodeRow[] = response.data.data.map((item) => ({
          id: item.accountingCode,
          accountingCode: item.accountingCode,
          description: item.description,
          glAccountType: item.glAccountType,
          glAccountName: item.glAccountName,
          glAccountNumber: item.glAccountNumber,
          glAccountGroup: item.glAccountGroup,
          rule: item.glRulePlugin
        }));

        setData(rows);
        setTotalCount(response.data.totalRecord);
        setPage(response.data.currentPage);
      } catch {
        setData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, searchTerm, filterValues, apiService]);

  // Event handlers
  const handleCreateNew = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const handleDialogSubmit = useCallback(
    async (formData: AddAccountingCodeFormData) => {
      setDialogLoading(true);
      try {
        const accountingCodeEntries = (formData.glAccountNumbers || []).map((entry) => ({
          accountingCode: formData.accountingCode,
          effectiveDate: formatLocalDateTime(entry.effectiveDate),
          expiryDate: entry.expirationDate ? formatLocalDateTime(entry.expirationDate) : null,
          glAccountNumber: entry.glAccountNumber
        }));

        const requestPayload = {
          accountingCode: formData.accountingCode,
          accountingCodeEntries,
          description: formData.name,
          notes: formData.notes,
          glAccountType: formData.glAccountType,
          glAccountName: formData.glAccountName,
          glRulePlugin: formData.glAccountingKeyPlugin,
          displaySequence: String(formData.displaySequence),
          glAccountNumber: accountingCodeEntries[0]?.glAccountNumber || '',
          glAccountGroup: formData.glAccountGroup
        };

        const newEntry = await apiService.createAccountingCodeV1(requestPayload);
        const newRow: AccountingCodeRow = {
          id: newEntry.accountingCode,
          accountingCode: newEntry.accountingCode,
          description: newEntry.description,
          glAccountType: newEntry.glAccountType,
          glAccountName: newEntry.glAccountName,
          glAccountNumber: newEntry.glAccountNumber,
          glAccountGroup: newEntry.glAccountGroup,
          rule: newEntry.glRulePlugin
        };

        setData((prevData) => [newRow, ...prevData]);
        setTotalCount((prev) => prev + 1);

        showSuccess('Accounting code created successfully!');
        setDialogOpen(false);
      } catch {
        showError('Failed to create accounting code. Please try again.');
      } finally {
        setDialogLoading(false);
      }
    },
    [apiService, formatLocalDateTime, showSuccess, showError]
  );

  const handleEdit = useCallback(
    async (row: AccountingCodeRow) => {
      setEditDialogLoading(true);
      try {
        const detailResponse = await apiService.getAccountingCodeV1(row.accountingCode);
        if (!isAccountingCodeDetail(detailResponse)) {
          throw new Error('Accounting code details not found');
        }
        const detail = detailResponse;
        const editData: EditAccountingCodeFormData = {
          id: row.id,
          accountingCode: detail.accountingCode,
          name: detail.description,
          glAccountType: detail.glAccountType,
          glAccountName: detail.glAccountName,
          displaySequence: detail.displaySequence,
          glAccountGroup: detail.glAccountGroup,
          glAccountingKeyPlugin: detail.glRulePlugin,
          glAccountNumbers: detail.accountingCodeEntries?.map((entry) => ({
            glAccountNumber: entry.glAccountNumber,
            effectiveDate: new Date(entry.effectiveDate),
            expirationDate: entry.expiryDate ? new Date(entry.expiryDate) : undefined
          })),
          notes: detail.notes
        };

        setSelectedRow(row);
        setEditFormData(editData);
        setEditDialogOpen(true);
      } catch {
        showError('Failed to load accounting code details. Please try again.');
      } finally {
        setEditDialogLoading(false);
      }
    },
    [apiService, showError]
  );

  const handleEditDialogClose = useCallback(() => {
    setEditDialogOpen(false);
    setSelectedRow(null);
    setEditFormData(null);
  }, []);

  const handleEditDialogSubmit = useCallback(
    async (formData: EditAccountingCodeFormData) => {
      setEditDialogLoading(true);
      try {
        const accountingCode = formData.accountingCode || selectedRow?.accountingCode || '';
        const accountingCodeEntries = (formData.glAccountNumbers || []).map((entry) => ({
          accountingCode,
          effectiveDate: formatLocalDateTime(entry.effectiveDate),
          expiryDate: entry.expirationDate ? formatLocalDateTime(entry.expirationDate) : null,
          glAccountNumber: entry.glAccountNumber
        }));

        const requestPayload = {
          accountingCode,
          accountingCodeEntries,
          description: formData.name,
          notes: formData.notes,
          glAccountType: formData.glAccountType,
          glAccountName: formData.glAccountName,
          glRulePlugin: formData.glAccountingKeyPlugin,
          displaySequence: String(formData.displaySequence),
          glAccountNumber: accountingCodeEntries[0]?.glAccountNumber || '',
          glAccountGroup: formData.glAccountGroup
        };

        const updatedEntry = await apiService.updateAccountingCodeV1(accountingCode, requestPayload);
        const updatedRow: AccountingCodeRow = {
          id: updatedEntry.accountingCode,
          accountingCode: updatedEntry.accountingCode,
          description: updatedEntry.description,
          glAccountType: updatedEntry.glAccountType,
          glAccountName: updatedEntry.glAccountName,
          glAccountNumber: updatedEntry.glAccountNumber,
          glAccountGroup: updatedEntry.glAccountGroup,
          rule: updatedEntry.glRulePlugin
        };

        setData((prevData) => prevData.map((item) => (item.id === updatedRow.id ? updatedRow : item)));

        showSuccess('Accounting code updated successfully!');
        setEditDialogOpen(false);
        setSelectedRow(null);
      } catch {
        showError('Failed to update accounting code. Please try again.');
      } finally {
        setEditDialogLoading(false);
      }
    },
    [apiService, selectedRow, formatLocalDateTime, showSuccess, showError]
  );

  const handleDelete = useCallback((row: AccountingCodeRow) => {
    setRowToDelete(row);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!rowToDelete) return;

    try {
      await apiService.deleteAccountingCode(rowToDelete.id);
      setData((prevData) => prevData.filter((item) => item.id !== rowToDelete.id));
      setTotalCount((prev) => prev - 1);

      showSuccess('Accounting code deleted successfully!');
    } catch {
      showError('Failed to delete accounting code. Please try again.');
    } finally {
      handleDeleteDialogClose();
    }
  }, [rowToDelete, apiService, showSuccess, showError, handleDeleteDialogClose]);

  const handleFilter = useCallback(() => {
    setFilterDialogOpen(true);
  }, []);

  const handleFilterApply = useCallback((filters: FilterValues) => {
    setFilterValues(filters);
    setPage(0);
  }, []);

  const handleFilterClear = useCallback(() => {
    setFilterValues({
      accountingCode: '',
      description: '',
      glAccountType: '',
      glAccountName: '',
      glAccountNumber: '',
      glAccountGroup: ''
    });
    setPage(0);
  }, []);

  const handleFilterDialogClose = useCallback(() => {
    setFilterDialogOpen(false);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(0);
  }, []);

  return {
    // Data
    data,
    loading,
    totalCount,
    page,
    pageSize,

    // Dialog states
    dialogOpen,
    dialogLoading,
    editDialogOpen,
    editDialogLoading,
    deleteDialogOpen,
    filterDialogOpen,

    // Selected data
    selectedRow,
    editFormData,
    rowToDelete,
    filterValues,

    // Dropdown options
    glAccountTypes,
    glAccountGroups,
    glAccountingKeyPlugins,

    // Event handlers
    handleCreateNew,
    handleDialogClose,
    handleDialogSubmit,
    handleEdit,
    handleEditDialogClose,
    handleEditDialogSubmit,
    handleDelete,
    handleDeleteDialogClose,
    handleDeleteConfirm,
    handleFilter,
    handleFilterApply,
    handleFilterClear,
    handleFilterDialogClose,
    handleSearch,
    handlePageChange,
    handlePageSizeChange
  };
}

export default useAccountingCodePage;
