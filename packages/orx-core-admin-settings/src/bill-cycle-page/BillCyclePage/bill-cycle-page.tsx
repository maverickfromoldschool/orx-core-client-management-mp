import React from 'react';
import {Box, Container} from '@mui/material';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {BillCycleOverviewCard, type BillCycleData, BillCycleDialog, type BillCycleDialogData} from '../../components';
import {DeleteConfirmationDialog} from '../../components/delete-confirmation-dialog';
import FilterPanel, {type FilterField} from '../../components/filter-panel';
import {billCycleApiService, type GetBillCyclesParams, type BillPeriodOption} from '../../services';

export function BillCyclePage() {
  const {showSuccess, showError} = useNotification();
  const [data, setData] = React.useState<BillCycleData[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string | number | null>>({});
  const [editingItem, setEditingItem] = React.useState<BillCycleData | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
  const [billingPeriodOptions, setBillingPeriodOptions] = React.useState<BillPeriodOption[]>([]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch bill cycles from API
  const fetchBillCycles = React.useCallback(
    async (page?: number, size?: number, filterParams?: Record<string, string | number | null>): Promise<void> => {
      setIsLoading(true);

      try {
        const params: GetBillCyclesParams = {
          page: page ?? 0,
          size: size ?? 10
        };

        // Add filters if provided and not empty
        const appliedFilters = filterParams !== undefined ? filterParams : {};

        if (appliedFilters['billCycleCode'] && String(appliedFilters['billCycleCode']).trim()) {
          params.billCycleCode = String(appliedFilters['billCycleCode']).trim();
        }
        if (appliedFilters['status'] && String(appliedFilters['status']).trim()) {
          params.status = String(appliedFilters['status']).trim();
        }
        if (appliedFilters['billPeriodCode'] && String(appliedFilters['billPeriodCode']).trim()) {
          params.billPeriodCode = String(appliedFilters['billPeriodCode']).trim();
        }
        if (appliedFilters['description'] && String(appliedFilters['description']).trim()) {
          params.description = String(appliedFilters['description']).trim();
        }

        const response = await billCycleApiService.getBillCycles(params);
        setData(response.billCycles);
        setTotalItems(response.count);
      } catch (err: unknown) {
        console.error('Error fetching bill cycles:', err);
        showError('Failed to load bill cycles');
        setData([]);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    },
    [showError]
  );

  // Fetch on mount
  React.useEffect(() => {
    fetchBillCycles(0, 10).catch((err: unknown) => {
      console.error('Failed to fetch bill cycles on mount:', err);
    });
  }, [fetchBillCycles]);

  // Fetch billing period options on mount
  React.useEffect(() => {
    const fetchBillingPeriodOptions = async () => {
      try {
        const options = await billCycleApiService.getBillPeriodTypes();
        setBillingPeriodOptions(options);
      } catch (error) {
        console.error('Failed to fetch billing period options:', error);
        // Set empty array on error to allow form to still function
        setBillingPeriodOptions([]);
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchBillingPeriodOptions();
  }, []);

  const handleRowClick = () => {
    // Handle row click - could navigate to detail page
  };

  const handleEdit = (itemId: string) => {
    const item = data.find((d) => d.billCycleCode === itemId);
    if (item) {
      // Schedules are already included in the bill cycle data
      setEditingItem(item);
      setDialogOpen(true);
    } else {
      console.error('Item not found with billCycleCode:', itemId);
    }
  };

  const handleDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await billCycleApiService.deleteBillCycle(itemToDelete);
      showSuccess('Bill cycle deleted successfully');
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      await fetchBillCycles(currentPage - 1, itemsPerPage, activeFilters);
    } catch (err: unknown) {
      console.error('Error deleting bill cycle:', err);
      showError('Failed to delete bill cycle');
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBillCycles(page - 1, itemsPerPage, activeFilters).catch((err: unknown) => {
      console.error('Failed to fetch bill cycles:', err);
    });
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  const handleFiltersClick = () => {
    setFilterDrawerOpen(true);
  };

  const handleApplyFilters = (filters: Record<string, string | number | null>) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    fetchBillCycles(0, itemsPerPage, filters).catch((err: unknown) => {
      console.error('Failed to fetch bill cycles with filters:', err);
    });
  };

  const handleSaveBillCycle = async (formData: BillCycleDialogData) => {
    try {
      setIsLoading(true);

      // Prepare schedules - mark new ones with empty identifier
      const billCycleScheduleList =
        formData.billCycleScheduleList?.map((schedule) => ({
          billCycleScheduleIdentifier: schedule.billCycleScheduleIdentifier.startsWith('schedule-')
            ? ''
            : schedule.billCycleScheduleIdentifier,
          billCycleCode: schedule.billCycleCode,
          scheduleDate: schedule.scheduleDate,
          closeDate: schedule.closeDate,
          startDate: schedule.startDate,
          endDate: schedule.endDate,
          accountingDate: schedule.accountingDate,
          finalize: schedule.finalize,
          isLinkedToBillCycleRun: schedule.isLinkedToBillCycleRun
        })) || [];

      // Prepare data for API - only fields from dialog
      const apiData = {
        billCycleCode: formData.billCycleCode,
        description: formData.description,
        billingPeriod: formData.billingPeriod,
        dailyRefresh: formData.dailyRefresh ? 'Y' : 'N',
        finalsReprocess: formData.finalsReprocess ? 'Y' : 'N',
        rollingDate: 'Y',
        billCycleScheduleList
      };

      if (formData.id) {
        // Update existing bill cycle
        await billCycleApiService.updateBillCycle({
          ...apiData,
          status: formData.status || 'ACT'
        });

        showSuccess('Bill cycle updated successfully');
      } else {
        // Create new bill cycle
        const createPayload = {
          ...apiData,
          status: 'ACT'
        };
        await billCycleApiService.createBillCycle(createPayload);

        showSuccess('Bill cycle created successfully');
      }

      setDialogOpen(false);
      await fetchBillCycles(currentPage - 1, itemsPerPage, activeFilters);
    } catch (err: unknown) {
      console.error('Error saving bill cycle:', err);
      showError('Failed to save bill cycle');
    } finally {
      setIsLoading(false);
    }
  };

  // Define filter fields
  const filterFields: FilterField[] = [
    {
      fieldKey: 'billCycleCode',
      label: 'Bill Cycle Code',
      fieldType: 'text'
    },
    {
      fieldKey: 'description',
      label: 'Description',
      fieldType: 'text'
    },
    {
      fieldKey: 'billPeriodCode',
      label: 'Billing Period',
      fieldType: 'dropdown',
      values: billingPeriodOptions.map((opt) => ({label: opt.label, value: opt.value}))
    }
  ];

  return (
    <Container maxWidth="xl" sx={{py: 4}}>
      <Box sx={{width: '100%'}}>
        <BillCycleOverviewCard
          data={data}
          totalItems={totalItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onAdd={handleAdd}
          onFiltersClick={handleFiltersClick}
          isLoading={isLoading}
          billingPeriodOptions={billingPeriodOptions}
        />
      </Box>

      {/* Filter Panel */}
      <FilterPanel
        open={filterDrawerOpen}
        onClose={() => {
          setFilterDrawerOpen(false);
        }}
        onApply={handleApplyFilters}
        fields={filterFields}
        currentFilters={activeFilters}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        count={1}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        itemText="Bill Cycle"
      />

      {/* Bill Cycle Dialog for Create/Edit */}
      <BillCycleDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        onSave={handleSaveBillCycle}
        billingPeriodOptions={billingPeriodOptions}
        initialData={
          editingItem
            ? {
                id: editingItem.billCycleCode,
                billCycleCode: editingItem.billCycleCode,
                billingPeriod: editingItem.billingPeriod,
                description: editingItem.description,
                dailyRefresh: editingItem.dailyRefresh === 'Y',
                finalsReprocess: editingItem.finalsReprocess === 'Y',
                status: editingItem.status,
                billCycleScheduleList: editingItem.billCycleScheduleList || []
              }
            : undefined
        }
        isSaving={isLoading}
      />
    </Container>
  );
}

export default BillCyclePage;
