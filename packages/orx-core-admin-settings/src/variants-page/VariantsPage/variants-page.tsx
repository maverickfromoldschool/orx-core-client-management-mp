import React from 'react';
import {Box, Container} from '@mui/material';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {VariantsOverviewCard, VariantDialog, type VariantData} from '../../components';
import {DeleteConfirmationDialog} from '../../components/delete-confirmation-dialog';
import FilterPanel, {type FilterField} from '../../components/filter-panel';
import {variantsApiService, type GetVariantsParams} from '../../services';

export function VariantsPage() {
  const {showSuccess, showError} = useNotification();
  const [data, setData] = React.useState<VariantData[]>([]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string | number | null>>({});
  const [editingItem, setEditingItem] = React.useState<VariantData | undefined>(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch variants from API
  const fetchVariants = React.useCallback(
    async (page?: number, size?: number, filterParams?: Record<string, string | number | null>): Promise<void> => {
      setIsLoading(true);

      try {
        const params: GetVariantsParams = {
          page: page ?? 0, // API uses 0-based indexing
          size: size ?? 10
        };

        // Add filters if provided and not empty
        const appliedFilters = filterParams !== undefined ? filterParams : {};

        // Only add filter parameters if they have actual values
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (appliedFilters['variantField'] && String(appliedFilters['variantField']).trim()) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          params.variantField = String(appliedFilters['variantField']).trim();
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (appliedFilters['variantName'] && String(appliedFilters['variantName']).trim()) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          params.variantName = String(appliedFilters['variantName']).trim();
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (appliedFilters['systemDefined']) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          params.systemDefined = appliedFilters['systemDefined'] as 'Y' | 'N';
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (appliedFilters['predefinedList']) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          params.predefinedList = appliedFilters['predefinedList'] as 'Y' | 'N';
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (appliedFilters['entity'] && String(appliedFilters['entity']).trim()) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          params.entity = String(appliedFilters['entity']).trim();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const response = await variantsApiService.getVariants(params);

        setData(response.variants);
        setTotalItems(response.count);
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error('Error fetching variants:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [] // Remove filters from dependency array to prevent multiple API calls
  );

  // Fetch on mount
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    fetchVariants(0, 10).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch variants on mount:', err);
    });
  }, [fetchVariants]);

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleRowClick = () => {
    // Handle row click
  };

  const handleEdit = async (itemId: string) => {
    try {
      setIsLoading(true);
      // Fetch full variant details from API
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const variant = await variantsApiService.getVariantById(itemId);

      if (variant) {
        setEditingItem(variant);
        setDialogOpen(true);
      }
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch variant for edit:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setIsLoading(true);
      const deletedItem = data.find((item) => item.id === itemToDelete);
      await variantsApiService.deleteVariant(itemToDelete);

      // Remove item from local data
      setData((prevData) => prevData.filter((item) => item.id !== itemToDelete));
      // Clear selection if deleted item was selected
      setSelectedIds((prevIds) => prevIds.filter((id) => id !== itemToDelete));
      // Update total items
      setTotalItems((prev) => prev - 1);

      showSuccess(
        <>
          <strong>{deletedItem?.variantField || 'Variant'}</strong> has been successfully deleted.
        </>
      );
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to delete variant:', err);
    } finally {
      setIsLoading(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    fetchVariants(page - 1, itemsPerPage, activeFilters).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch variants on page change:', err);
    });
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  const handleFilters = () => {
    setFilterDrawerOpen(true);
  };

  const handleFilterPanelClose = () => {
    setFilterDrawerOpen(false);
  };

  const handleApplyFilters = async (newFilters: Record<string, string | number | null>) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
    setFilterDrawerOpen(false);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await fetchVariants(0, itemsPerPage, newFilters);
  };

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = React.useMemo(
    () => [
      {
        label: 'Variant Field',
        fieldKey: 'variantField',
        fieldType: 'text'
      },
      {
        label: 'Variant Name',
        fieldKey: 'variantName',
        fieldType: 'text'
      },
      {
        label: 'System Defined',
        fieldKey: 'systemDefined',
        fieldType: 'dropdown',
        values: [
          {label: 'Yes', value: 'Y'},
          {label: 'No', value: 'N'}
        ]
      },
      {
        label: 'Predefined List',
        fieldKey: 'predefinedList',
        fieldType: 'dropdown',
        values: [
          {label: 'Yes', value: 'Y'},
          {label: 'No', value: 'N'}
        ]
      },
      {
        label: 'Entity',
        fieldKey: 'entity',
        fieldType: 'text'
      }
    ],
    []
  );

  // TODO: Re-enable when bulk actions are implemented
  // const handleBulkAction = (action: BulkAction) => {
  //   // Handle bulk action
  //   // TODO: Implement bulk actions based on action type
  //   if (action) {
  //     // Perform bulk action on selectedIds
  //   }
  // };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(undefined);
  };

  const handleSave = async (variantData: VariantData) => {
    try {
      if (editingItem) {
        // Update existing variant via API
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const updatedVariant = await variantsApiService.updateVariant(
          editingItem.id,
          variantData,
          'admin-user' // TODO: Get from auth context
        );

        // Update local state with response
        setData((prevData) => prevData.map((item) => (item.id === editingItem.id ? updatedVariant : item)));

        showSuccess(
          <>
            <strong>{variantData.variantField}</strong> variant has been successfully updated.
          </>
        );
      } else {
        // Create new variant via API
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const newVariant = await variantsApiService.createVariant(variantData, 'admin-user'); // TODO: Get from auth context

        // Add new item to local state
        setData((prevData) => [newVariant, ...prevData]);
        // Update total items
        setTotalItems((prev) => prev + 1);
        // Reset to first page when adding new item
        setCurrentPage(1);

        showSuccess(
          <>
            <strong>{variantData.variantField}</strong> variant has been successfully created.
          </>
        );
      }

      handleDialogClose();
    } catch (err: unknown) {
      // eslint-disable-next-line no-console
      console.error('Failed to save variant:', err);

      // Extract error message from API response
      let errorMessage = 'Failed to save variant. Please try again.';
      if (err && typeof err === 'object' && 'details' in err) {
        const apiError = err as {details?: {details?: {message?: string}[]}};
        if (
          apiError.details?.details &&
          Array.isArray(apiError.details.details) &&
          apiError.details.details.length > 0 &&
          apiError.details.details[0]?.message
        ) {
          errorMessage = apiError.details.details[0].message;
        }
      }

      showError(errorMessage);
    }
  };

  return (
    <Container maxWidth="xl" sx={{py: 3}}>
      <Box sx={{mb: 3}}>
        <VariantsOverviewCard
          data={data}
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

      <VariantDialog open={dialogOpen} onClose={handleDialogClose} onSave={handleSave} initialData={editingItem} />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        count={1}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={isLoading}
        itemText="variant"
      />

      <FilterPanel
        open={filterDrawerOpen}
        onClose={handleFilterPanelClose}
        fields={filterFields}
        currentFilters={activeFilters}
        onApply={handleApplyFilters}
      />
    </Container>
  );
}

export default VariantsPage;
