import React from 'react';
import {Container} from '@mui/material';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {
  ProductGroupOverviewCard,
  type ProductGroupData,
  FilterPanel,
  type FilterField,
  DeleteConfirmationDialog
} from '../../components';
import {ProductGroupDialog} from '../../product-group-dialog/ProductGroupDialog/product-group-dialog';
import {useProductGroup} from '../useProductGroup/use-product-group';

export function ProductGroup() {
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
    loadProductGroups,
    productCategoryOptions,
    externalSystemOptions,
    accountingCodeOptions,
    attributeOptions,
    variantOptions,
    uomOptions,
    lookupsLoading
  } = useProductGroup();

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit' | 'copy'>('create');
  const [filterPanelOpen, setFilterPanelOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string | number | null>>({});
  const [editingItem, setEditingItem] = React.useState<ProductGroupData | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteItemId, setDeleteItemId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Filter fields configuration for product groups
  const filterFields: FilterField[] = [
    {
      label: 'Product Group',
      fieldKey: 'productGroup',
      fieldType: 'text'
    },
    {
      label: 'Name',
      fieldKey: 'name',
      fieldType: 'text'
    },
    {
      label: 'Product Category',
      fieldKey: 'productCategory',
      fieldType: 'text'
    },
    {
      label: 'External System',
      fieldKey: 'externalSystem',
      fieldType: 'text'
    },
    {
      label: 'Ignore Child Entities',
      fieldKey: 'isIgnoreChildEntities',
      fieldType: 'dropdown',
      values: [
        {label: 'Yes', value: 'Y'},
        {label: 'No', value: 'N'}
      ]
    }
  ];

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleRowClick = () => {
    // Handle row click if needed
  };

  const handleEdit = (itemId: string) => {
    const item = data.find((d) => d.productGroup === itemId);
    if (item) {
      setEditingItem(item);
      setDialogMode('edit');
      setDialogOpen(true);
    }
  };

  const handleCopy = (itemId: string) => {
    const item = data.find((d) => d.productGroup === itemId);
    if (item) {
      setEditingItem(item);
      setDialogMode('copy');
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
      showSuccess('Product group deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete product group';
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
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveClick = async (formData: ProductGroupData) => {
    try {
      const dataToSave = editingItem ? {...editingItem, ...formData} : formData;
      const isUpdate = !!editingItem;

      await handleSave(dataToSave);

      if (!editingItem) {
        setCurrentPage(0);
      }

      handleDialogClose();

      let message = 'Product group created successfully';
      if (isUpdate) {
        message = 'Product group updated successfully';
      } else if (dialogMode === 'copy') {
        message = 'Product group copied successfully';
      }
      showSuccess(message);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save product group';
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
    // When applying filters, use page=0 and size=100
    await loadProductGroups(0, 100, filters);
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
  //       showSuccess('Bulk action completed successfully');
  //     } catch (error) {
  //       const errorMessage = error instanceof Error ? error.message : 'Failed to perform bulk action';
  //       showError(errorMessage);
  //     }
  //   }
  // };

  return (
    <Container maxWidth="xl" sx={{py: 4}}>
      <ProductGroupOverviewCard
        data={data}
        totalItems={totalElements}
        selectedIds={selectedIds}
        currentPage={currentPage}
        totalPages={totalPages}
        onSelectionChange={handleSelectionChange}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onCopy={handleCopy}
        onPageChange={handlePageChange}
        onAdd={handleAdd}
        onFiltersClick={handleFiltersClick}
        isLoading={isLoading}
        productCategoryOptions={productCategoryOptions}
        externalSystemOptions={externalSystemOptions}
      />

      <ProductGroupDialog
        open={dialogOpen}
        mode={dialogMode}
        onClose={handleDialogClose}
        onSave={handleSaveClick}
        initialValue={editingItem || undefined}
        productCategoryOptions={productCategoryOptions}
        externalSystemOptions={externalSystemOptions}
        accountingCodeOptions={accountingCodeOptions}
        attributeOptions={attributeOptions}
        variantOptions={variantOptions}
        uomOptions={uomOptions}
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
        itemText="Product Group"
      />
    </Container>
  );
}

export default ProductGroup;
