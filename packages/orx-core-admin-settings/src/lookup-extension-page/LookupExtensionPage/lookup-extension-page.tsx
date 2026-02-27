'use client';

import React from 'react';
import {Box, Container} from '@mui/material';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {LookupExtensionOverviewCard, type TableColumn, DeleteConfirmationDialog} from '../../components';
import FilterPanel, {type FilterField} from '../../components/filter-panel';
import {LookupExtensionDialog} from '../../lookup-extension-dialog/LookupExtensionDialog/lookup-extension-dialog';
import {useLookupExtensionPage} from '../useLookupExtensionPage/use-lookup-extension-page';
import {useLookupExtensionApi} from '../useLookupExtensionApi/use-lookup-extension-api';

import {LookupExtensionPageProps} from './lookup-extension-page.types';

export function LookupExtensionPage(props: LookupExtensionPageProps) {
  const hook = useLookupExtensionPage(props);
  const lookupApi = useLookupExtensionApi();
  const {showSuccess, showError} = useNotification();
  const {
    data,
    total,
    totalPages,
    page,
    loading,
    onPageChange,
    lookupCodeOptions,
    lookupsLoading,
    dataTypeOptions,
    dataTypesLoading,
    refresh,
    applyFilters,
    filters
  } = hook;
  const {text} = props;

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [selectedRow, setSelectedRow] = React.useState<Record<string, unknown> | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [deleteItemId, setDeleteItemId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleSelectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleEdit = (item: Record<string, unknown>) => {
    // open dialog and populate with the selected row
    setSelectedRow(item ?? null);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteItemId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;

    // Find the item to get both extensionCode and field
    const item = data.find((d) => {
      return d['objectCode'] === deleteItemId;
    });
    if (!item) {
      showError('Item not found for delete');
      setDeleteConfirmOpen(false);
      setDeleteItemId(null);
      return;
    }

    const itemRecord = item;
    const extensionCode = itemRecord['objectCode'] as string;
    const field = itemRecord['field'] as string;

    if (!extensionCode || !field) {
      showError('Missing extensionCode or field for delete');
      setDeleteConfirmOpen(false);
      setDeleteItemId(null);
      return;
    }

    setIsDeleting(true);
    try {
      await lookupApi.deleteLookupExtension(extensionCode, field);
      setSelectedIds((prevIds) => prevIds.filter((id) => id !== deleteItemId));
      showSuccess('Lookup extension deleted successfully');
      // Refresh the list after successful delete
      refresh();
    } catch (deleteError) {
      const errorMessage = deleteError instanceof Error ? deleteError.message : 'Failed to delete lookup extension';
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

  const handleAdd = () => {
    // open dialog
    setDialogOpen(true);
  };

  const handleFilters = () => {
    // open the page-level filter panel (loose coupling: LookupActionBar simply signals via onFiltersClick)
    setFiltersOpen(true);
  };

  // TODO: Re-enable when bulk actions are implemented
  // const handleBulkAction = (action: any) => {
  //   // placeholder
  //   // eslint-disable-next-line no-console
  //   console.log('Bulk action', action, selectedIds);
  // };

  const columns: TableColumn[] = [
    {id: 'actions', label: 'Actions', width: 100},
    {id: 'objectCode', label: 'Extension Code', width: 250},
    {id: 'name', label: 'Name', width: 250},
    {id: 'field', label: 'Lookup Field', width: 180},
    {id: 'systemDefined', label: 'Managed By', width: 140}
  ];
  return (
    <Container maxWidth="xl" sx={{py: 3}}>
      <Box sx={{mb: 3}}>
        <LookupExtensionOverviewCard
          data={data}
          totalItems={total}
          selectedIds={selectedIds}
          currentPage={page}
          totalPages={Math.max(1, totalPages)}
          onSelectionChange={(ids) => {
            handleSelectAll(ids);
          }}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onPageChange={onPageChange}
          onAdd={handleAdd}
          onFiltersClick={handleFilters}
          isLoading={loading}
          columns={columns}
        />
      </Box>
      {/* Page-level filter panel (loose coupling) */}
      <FilterPanel
        open={filtersOpen}
        onClose={() => {
          setFiltersOpen(false);
        }}
        fields={
          [
            {label: 'Extension Code', fieldKey: 'extensionCode', fieldType: 'text'},
            {label: 'Lookup Field', fieldKey: 'field', fieldType: 'text'},
            {label: 'Display Name', fieldKey: 'name', fieldType: 'text'},
            {
              label: 'System Defined',
              fieldKey: 'systemDefined',
              fieldType: 'dropdown',
              values: [
                {label: 'Yes', value: 'Y'},
                {label: 'No', value: 'N'}
              ]
            }
          ] as FilterField[]
        }
        currentFilters={filters}
        onApply={(appliedFilters) => {
          applyFilters(appliedFilters);
          setFiltersOpen(false);
        }}
      />
      <LookupExtensionDialog
        text={text}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedRow(null);
        }}
        onSave={() => {
          // Refresh the list after successful save
          refresh();
        }}
        initialData={selectedRow}
        lookupCodeOptions={lookupCodeOptions}
        lookupsLoading={lookupsLoading}
        dataTypeOptions={dataTypeOptions}
        dataTypesLoading={dataTypesLoading}
      />

      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        count={1}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={isDeleting}
        itemText="Lookup Extension"
      />
    </Container>
  );
}

export default LookupExtensionPage;
