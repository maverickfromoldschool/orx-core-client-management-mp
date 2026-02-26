import React from 'react';
import {Box, Container} from '@mui/material';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {LookupOverviewCard, type LookupData} from '../../components';
import {LookupFieldDialog, type LookupFieldData} from '../../lookup-field-dialog';
import FilterPanel, {type FilterField} from '../../components/filter-panel';
import {lookupApiService} from '../../services';

export function LookupPage() {
  const {showSuccess} = useNotification();
  const [data, setData] = React.useState<LookupData[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<LookupData | undefined>(undefined);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [appliedFilters, setAppliedFilters] = React.useState<Record<string, string | number | null>>({});

  const itemsPerPage = 10;

  // Fetch lookup fields from API
  const fetchLookupFields = React.useCallback(
    async (filterParams?: Record<string, string | number | null>) => {
      setIsLoading(true);
      try {
        const response = await lookupApiService.searchLookupFields({
          page: currentPage - 1, // API uses 0-based indexing
          size: itemsPerPage
        });

        // Map API response to LookupData format
        let mappedData: LookupData[] = response.fields.map((item) => ({
          id: item.id,
          lookupField: item.lookupField,
          displayName: item.displayName,
          managedBy: item.managedBy,
          numericValue: item.numericValue ? 'Yes' : 'No',
          maxStoredValueLength: item.maxStoredValueLength,
          values: item.values
        }));

        // Apply client-side filtering if filters are provided
        if (filterParams && Object.keys(filterParams).length > 0) {
          mappedData = mappedData.filter((item) => {
            let match = true;

            if (filterParams['lookupField'] && String(filterParams['lookupField']).trim()) {
              match =
                match &&
                item.lookupField.toLowerCase().includes(String(filterParams['lookupField']).toLowerCase().trim());
            }

            if (filterParams['displayName'] && String(filterParams['displayName']).trim()) {
              match =
                match &&
                item.displayName.toLowerCase().includes(String(filterParams['displayName']).toLowerCase().trim());
            }

            if (filterParams['managedBy']) {
              match = match && item.managedBy === filterParams['managedBy'];
            }

            if (filterParams['numericValue']) {
              match = match && item.numericValue === filterParams['numericValue'];
            }

            return match;
          });
        }

        setData(mappedData);
        setTotalItems(
          filterParams && Object.keys(filterParams).length > 0 ? mappedData.length : response.totalElements
        );
        setTotalPages(
          filterParams && Object.keys(filterParams).length > 0
            ? Math.ceil(mappedData.length / itemsPerPage)
            : response.totalPages
        );
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch lookup fields:', error);
        // Keep existing data on error
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage]
  );

  React.useEffect(() => {
    fetchLookupFields(appliedFilters).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch lookup fields:', err);
    });
  }, [fetchLookupFields, appliedFilters]);

  // Get paginated data (already paginated from API)
  const paginatedData = data;

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleRowClick = () => {
    // Handle row click
  };

  const handleEdit = (itemId: string) => {
    // Find the item in the current data
    const item = data.find((d) => d.id === itemId);

    if (item) {
      setEditingItem(item);
      setDialogOpen(true);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      const deletedItem = data.find((item) => item.id === itemId);
      await lookupApiService.deleteLookupField(itemId);
      // Clear selection if deleted item was selected
      setSelectedIds((prevIds) => prevIds.filter((id) => id !== itemId));
      // Refresh the list from API to get updated data and pagination
      await fetchLookupFields();

      showSuccess(
        <>
          <strong>{deletedItem?.lookupField || 'Lookup field'}</strong> has been successfully deleted.
        </>
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete lookup field:', error);
      // Optionally show error notification to user
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(undefined);
  };

  const handleSave = async (formData: LookupFieldData) => {
    setIsSaving(true);
    try {
      if (editingItem) {
        // Update existing lookup field via API
        const updatedField = await lookupApiService.updateLookupField(
          editingItem.id,
          {
            id: editingItem.id,
            lookupField: formData.lookupField,
            displayName: formData.displayName,
            maxStoredValueLength: formData.maxStoredValueLength,
            numericValue: formData.numericValue,
            managedBy: formData.managedBy || 'User',
            values: formData.values
          },
          'admin-user' // TODO: Get from auth context
        );

        // Update local state with response
        setData((prevData) =>
          prevData.map((item) =>
            item.id === editingItem.id
              ? {
                  ...item,
                  lookupField: updatedField.lookupField,
                  displayName: updatedField.displayName,
                  maxStoredValueLength: updatedField.maxStoredValueLength,
                  numericValue: updatedField.numericValue ? 'Yes' : 'No',
                  managedBy: updatedField.managedBy,
                  values: updatedField.values
                }
              : item
          )
        );
        showSuccess(
          <>
            <strong>{formData.lookupField}</strong> lookup field has been successfully updated.
          </>
        );
      } else {
        // Create new lookup field via API
        await lookupApiService.createLookupField(
          {
            lookupField: formData.lookupField,
            displayName: formData.displayName,
            maxStoredValueLength: formData.maxStoredValueLength,
            numericValue: formData.numericValue,
            managedBy: formData.managedBy || 'User',
            values: formData.values
          },
          'admin-user' // TODO: Get from auth context
        );

        // Reset to first page when adding new item
        setCurrentPage(1);
        // Refresh the list from API to get complete data including values (POST response returns empty values array)
        await fetchLookupFields();

        showSuccess(
          <>
            <strong>{formData.lookupField}</strong> lookup field has been successfully created.
          </>
        );
      }

      // Close dialog on success
      setDialogOpen(false);
      setEditingItem(undefined);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save lookup field:', error);
      // Optionally show error notification to user
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilters = () => {
    setFilterDrawerOpen(true);
  };

  const handleApplyFilters = (newFilters: Record<string, string | number | null>) => {
    setAppliedFilters(newFilters);
    setCurrentPage(1);
    setFilterDrawerOpen(false);
  };

  const handleCloseFilterDrawer = () => {
    setFilterDrawerOpen(false);
  };

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = React.useMemo(
    () => [
      {
        label: 'Lookup Field',
        fieldKey: 'lookupField',
        fieldType: 'text'
      },
      {
        label: 'Display Name',
        fieldKey: 'displayName',
        fieldType: 'text'
      },
      {
        label: 'Managed By',
        fieldKey: 'managedBy',
        fieldType: 'dropdown',
        values: [
          {label: 'User', value: 'User'},
          {label: 'System', value: 'System'}
        ]
      },
      {
        label: 'Numeric Value',
        fieldKey: 'numericValue',
        fieldType: 'dropdown',
        values: [
          {label: 'Yes', value: 'Yes'},
          {label: 'No', value: 'No'}
        ]
      }
    ],
    []
  );

  // TODO: Re-enable when bulk actions are implemented
  // const handleBulkAction = () => {
  //   // Handle bulk action
  // };

  return (
    <Container maxWidth="xl" sx={{py: 3}}>
      <Box sx={{mb: 3}}>
        <LookupOverviewCard
          data={paginatedData}
          totalItems={totalItems}
          selectedIds={selectedIds}
          currentPage={currentPage}
          totalPages={totalPages}
          onSelectionChange={handleSelectionChange}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onAdd={handleAdd}
          onFiltersClick={handleFilters}
          isLoading={isLoading}
        />
      </Box>

      <LookupFieldDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
        initialData={
          editingItem
            ? {
                lookupField: editingItem.lookupField,
                displayName: editingItem.displayName,
                maxStoredValueLength: editingItem.maxStoredValueLength || '',
                numericValue: editingItem.numericValue === 'Yes',
                values: editingItem.values,
                managedBy: editingItem.managedBy
              }
            : undefined
        }
        isSaving={isSaving}
      />

      <FilterPanel
        open={filterDrawerOpen}
        onClose={handleCloseFilterDrawer}
        fields={filterFields}
        currentFilters={appliedFilters}
        onApply={handleApplyFilters}
      />
    </Container>
  );
}

export default LookupPage;
