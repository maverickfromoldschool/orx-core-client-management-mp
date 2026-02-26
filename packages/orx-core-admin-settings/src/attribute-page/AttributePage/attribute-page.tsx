import React from 'react';
import {Container} from '@mui/material';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {
  type AttributeData,
  AttributeOverviewCard,
  FilterPanel,
  type FilterField,
  DeleteConfirmationDialog
} from '../../components';
import {AttributeFieldDialog} from '../../attribute-field-dialog/AttributeFieldDialog/attribute-field-dialog';

import {useAttributePage} from './useAttributePage';

export function AttributePage() {
  const {showSuccess, showError} = useNotification();
  const {
    data,
    isLoading,
    totalElements,
    totalPages,
    currentPage,
    setCurrentPage,
    handleSave,
    handleDelete,
    // handleBulkAction, // TODO: Re-enable when bulk actions are implemented
    // handleExport, // TODO: Re-enable when bulk actions are implemented
    loadAttributes,
    dataTypeOptions,
    fieldTypeOptions,
    fieldOptions,
    entityOptions,
    lookupsLoading
  } = useAttributePage();

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string | number | null>>({});
  const [editingItem, setEditingItem] = React.useState<AttributeData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteItemId, setDeleteItemId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Filter fields configuration for attributes
  const filterFields: FilterField[] = [
    {
      label: 'Attribute',
      fieldKey: 'attribute',
      fieldType: 'text'
    },
    {
      label: 'Description',
      fieldKey: 'description',
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
    }
  ];

  // TODO: Re-enable when bulk actions are implemented
  // const handleSelectionChange = (ids: string[]) => {
  //   setSelectedIds(ids);
  // };

  const handleRowClick = () => {
    // Handle row click if needed
  };

  const handleEdit = (itemId: string) => {
    const item = data.find((d) => d.attribute === itemId);
    if (item) {
      setEditingItem(item);
      setDialogOpen(true);
    }
  };

  const handleDeleteClick = (itemId: string) => {
    setDeleteItemId(itemId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;

    setIsDeleting(true);
    try {
      await handleDelete(deleteItemId);
      setSelectedIds((prevIds) => prevIds.filter((id) => id !== deleteItemId));
      showSuccess('Attribute deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete attribute';
      showError(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setDeleteItemId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setDeleteItemId(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveClick = async (formData: AttributeData) => {
    try {
      const dataToSave = editingItem ? {...editingItem, ...formData} : formData;
      const isUpdate = !!editingItem;

      await handleSave(dataToSave);

      if (!editingItem) {
        setCurrentPage(0);
      }

      handleDialogClose();

      const message = isUpdate ? 'Attribute updated successfully' : 'Attribute created successfully';
      showSuccess(message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save attribute';
      showError(errorMessage);
    }
  };

  const handleFiltersClick = () => {
    setFilterPanelOpen(true);
  };

  const handleFilterPanelClose = () => {
    setFilterPanelOpen(false);
  };

  const handleFilterApply = async (filters: Record<string, string | number | null>) => {
    setActiveFilters(filters);
    setCurrentPage(0);
    await loadAttributes(0, undefined, filters);
    setFilterPanelOpen(false);
  };

  // TODO: Re-enable when bulk actions are implemented
  // const handleBulkActionClick = async (action: string) => {
  //   if (action === 'export') {
  //     handleExport();
  //   } else {
  //     try {
  //       await handleBulkAction(action, selectedIds);
  //       setSelectedIds([]);
  //     } catch {
  //       // Error already logged in hook
  //     }
  //   }
  // };

  return (
    <Container maxWidth="xl" sx={{py: 4}}>
      <AttributeOverviewCard
        data={data}
        totalItems={totalElements}
        selectedIds={selectedIds}
        currentPage={currentPage}
        totalPages={totalPages}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onPageChange={handlePageChange}
        onAdd={handleAdd}
        onFiltersClick={handleFiltersClick}
        isLoading={isLoading}
      />

      <AttributeFieldDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveClick}
        attribute={editingItem || null}
        dataTypeOptions={dataTypeOptions}
        fieldTypeOptions={fieldTypeOptions}
        fieldOptions={fieldOptions}
        entityOptions={entityOptions}
        lookupsLoading={lookupsLoading}
      />

      <FilterPanel
        open={filterPanelOpen}
        onClose={handleFilterPanelClose}
        fields={filterFields}
        currentFilters={activeFilters}
        onApply={handleFilterApply}
      />

      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        count={1}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={isDeleting}
        itemText="Atribute"
      />
    </Container>
  );
}

export default AttributePage;
