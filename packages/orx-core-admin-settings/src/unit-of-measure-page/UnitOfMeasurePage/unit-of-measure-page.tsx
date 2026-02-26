import React from 'react';
import {
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {UomOverviewCard} from '../../components/uom-overview-card';
import type {UnitOfMeasureData} from '../../components/uom-table';
import {UomDialog, type UomDialogFormData, type UnitTypeOption} from '../../uom-dialog';
import FilterPanel, {type FilterField} from '../../components/filter-panel';
import {uomApiService} from '../../services/uom.service';

export function UnitOfMeasurePage() {
  const {showSuccess, showError} = useNotification();
  const [data, setData] = React.useState<UnitOfMeasureData[]>([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [unitTypeOptions, setUnitTypeOptions] = React.useState<UnitTypeOption[]>([]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string | number | null>>({});
  const [editingItem, setEditingItem] = React.useState<UnitOfMeasureData | undefined>(undefined);
  const [itemToDelete, setItemToDelete] = React.useState<UnitOfMeasureData | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Fetch UOMs from API
  const fetchUoms = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await uomApiService.getUoms({
        page: currentPage - 1, // API uses 0-based pagination
        size: itemsPerPage,
        uom: activeFilters['uom'] as string | undefined,
        description: activeFilters['description'] as string | undefined,
        decimals: activeFilters['decimals'] as number | undefined,
        unitTypeCd: activeFilters['unitTypeCd'] as string | undefined,
        appendToQuantity: activeFilters['appendToQuantity'] as string | undefined
      });
      setData(response.uoms);
      setTotalCount(response.count);
    } catch {
      setData([]);
      setTotalCount(0);
      showError('Failed to fetch unit of measures. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeFilters]);

  // Fetch data when page or filters change
  React.useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchUoms();
  }, [fetchUoms]);

  // Fetch unit types on mount
  React.useEffect(() => {
    const fetchUnitTypes = async () => {
      try {
        const types = await uomApiService.getUnitTypes();
        setUnitTypeOptions(types);
      } catch {
        // Error is handled silently
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchUnitTypes();
  }, []);

  // Define filter fields for the FilterPanel
  const filterFields: FilterField[] = React.useMemo(
    () => [
      {
        label: 'Unit of Measure',
        fieldKey: 'uom',
        fieldType: 'text'
      },
      {
        label: 'Description',
        fieldKey: 'description',
        fieldType: 'text'
      },
      {
        label: 'Decimals',
        fieldKey: 'decimals',
        fieldType: 'dropdown',
        values: Array.from({length: 19}, (_, i) => ({label: String(i), value: i}))
      },
      {
        label: 'Unit Type',
        fieldKey: 'unitTypeCd',
        fieldType: 'dropdown',
        values: unitTypeOptions.map((opt) => ({label: opt.label, value: opt.value}))
      },
      {
        label: 'Append to Count',
        fieldKey: 'appendToQuantity',
        fieldType: 'dropdown',
        values: [
          {label: 'Yes', value: 'Y'},
          {label: 'No', value: 'N'}
        ]
      }
    ],
    [unitTypeOptions]
  );

  const handleRowClick = () => {
    // Handle row click if needed
  };

  const handleEdit = (itemId: string) => {
    const item = data.find((d) => d.uom === itemId);
    if (item) {
      setEditingItem(item);
      setDialogOpen(true);
    }
  };

  const handleDelete = (itemId: string) => {
    const item = data.find((d) => d.uom === itemId);
    if (item) {
      setItemToDelete(item);
      setDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await uomApiService.deleteUom(itemToDelete.uom);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        showSuccess(
          <>
            <strong>{itemToDelete.uom}</strong> has been successfully deleted.
          </>
        );
        // Refetch data after successful deletion
        await fetchUoms();
      } catch {
        showError(
          <>
            Failed to delete <strong>{itemToDelete.uom}</strong>. Please try again.
          </>
        );
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
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

  const handleSave = async (formData: UomDialogFormData) => {
    setIsSaving(true);
    try {
      const uomData: UnitOfMeasureData = {
        uom: formData.uom,
        description: formData.description,
        decimals: formData.decimals,
        unitTypeCd: formData.unitTypeCd,
        appendToQuantity: formData.appendToQuantity
      };

      if (editingItem) {
        // Update existing item
        await uomApiService.updateUom(uomData);
        showSuccess(
          <>
            <strong>{formData.uom}</strong> has been successfully updated.
          </>
        );
      } else {
        // Create new item
        await uomApiService.createUom(uomData);
        showSuccess(
          <>
            <strong>{formData.uom}</strong> has been successfully created.
          </>
        );
        // Reset to first page when adding new item
        setCurrentPage(1);
      }

      // Close dialog on success
      setDialogOpen(false);
      setEditingItem(undefined);
      // Refetch data after successful save
      await fetchUoms();
    } catch {
      showError(
        <>
          Failed to {editingItem ? 'update' : 'create'} <strong>{formData.uom}</strong>. Please try again.
        </>
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFilters = () => {
    setFilterDrawerOpen(true);
  };

  const handleFilterPanelClose = () => {
    setFilterDrawerOpen(false);
  };

  const handleApplyFilters = (newFilters: Record<string, string | number | null>) => {
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to first page when applying filters
    setFilterDrawerOpen(false);
  };

  return (
    <Container maxWidth="xl" sx={{py: 3}}>
      <Box sx={{mb: 3}}>
        <UomOverviewCard
          data={data}
          totalItems={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
          onAdd={handleAdd}
          onFiltersClick={handleFilters}
          isLoading={isLoading}
        />
      </Box>

      <UomDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
        initialData={
          editingItem
            ? {
                uom: editingItem.uom,
                description: editingItem.description,
                decimals: editingItem.decimals,
                unitTypeCd: editingItem.unitTypeCd,
                appendToQuantity: editingItem.appendToQuantity
              }
            : undefined
        }
        unitTypeOptions={unitTypeOptions}
        isSaving={isSaving}
      />

      <FilterPanel
        open={filterDrawerOpen}
        onClose={handleFilterPanelClose}
        fields={filterFields}
        currentFilters={activeFilters}
        onApply={handleApplyFilters}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            padding: '8px'
          }
        }}
      >
        <DialogTitle
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", sans-serif',
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Delete</span>
          <IconButton
            onClick={handleCancelDelete}
            sx={{
              padding: '4px',
              color: '#4B4D4F',
              '&:hover': {
                backgroundColor: '#F5F5F5'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#4B4D4F',
              fontFamily: '"Enterprise Sans VF", sans-serif'
            }}
          >
            You are about to delete the unit of measure <strong>{itemToDelete?.uom}</strong>. Are you sure you want to
            proceed?
          </Typography>
        </DialogContent>
        <DialogActions sx={{px: 3, pb: 2, justifyContent: 'flex-start', gap: '10px'}}>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              minWidth: '133px',
              height: '40px',
              borderRadius: '46px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: '#002677',
              color: '#FBF9F4',
              textTransform: 'none',
              fontFamily: '"Enterprise Sans VF", sans-serif',
              '&:hover': {
                backgroundColor: '#001A52'
              },
              '&.Mui-disabled': {
                backgroundColor: '#E5E5E6',
                color: '#999999'
              }
            }}
          >
            Yes, Delete
          </Button>
          <Button
            onClick={handleCancelDelete}
            sx={{
              minWidth: '133px',
              height: '40px',
              borderRadius: '46px',
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 600,
              border: '1px solid #002677',
              backgroundColor: '#FBF9F4',
              color: '#002677',
              textTransform: 'none',
              fontFamily: '"Enterprise Sans VF", sans-serif',
              '&:hover': {
                backgroundColor: '#FBF9F4'
              }
            }}
          >
            No, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default UnitOfMeasurePage;
