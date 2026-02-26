import React from 'react';
import {Box, Container} from '@mui/material';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {useTransactionFields} from '../../../hooks/use-transaction-fields';

import {TransactionFieldsOverviewCard} from './transaction-fields-overview-card';
import {TransactionFieldDialog} from './transaction-field-dialog';
import {type TransactionFieldData} from './transaction-field-dialog.types';
import {DeleteConfirmationDialog} from './delete-confirmation-dialog';

interface TransactionFieldsPageProps {
  productId: string;
}

export function TransactionFieldsPage({productId}: TransactionFieldsPageProps) {
  const {showSuccess, showError} = useNotification();
  const {
    getTransactionFields,
    createTransactionField,
    updateTransactionField,
    deleteTransactionField,
    isLoading: isSaving
  } = useTransactionFields();
  const [data, setData] = React.useState<TransactionFieldData[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TransactionFieldData | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

  const itemsPerPage = 5;
  const totalItems = data.length;

  // Fetch transaction fields on mount
  React.useEffect(() => {
    const fetchTransactionFields = async () => {
      setIsLoadingData(true);
      const fields = await getTransactionFields({
        productId,
        page: 0,
        pageSize: 100 // Fetch all for now
      });

      if (fields) {
        setData(fields);
      }
      setIsLoadingData(false);
    };

    if (productId) {
      fetchTransactionFields().catch((err: unknown) => {
        // eslint-disable-next-line no-console
        console.error('Error fetching transaction fields:', err);
      });
    }
  }, [productId, getTransactionFields]);

  // Get paginated data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage]);

  const handleRowClick = () => {
    // Handle row click
  };

  const handleEdit = (transactionAttribute: string) => {
    const item = data.find((field) => field.transactionAttribute === transactionAttribute);
    if (item) {
      setEditingItem(item);
      setDialogOpen(true);
    }
  };

  const handleDelete = (transactionAttribute: string) => {
    setItemToDelete(transactionAttribute);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      const deletedItem = data.find((item) => item.transactionAttribute === itemToDelete);

      if (deletedItem) {
        const success = await deleteTransactionField({
          productId,
          transactionAttribute: deletedItem.transactionAttribute
        });

        if (success) {
          setData((prevData) => prevData.filter((item) => item.transactionAttribute !== itemToDelete));

          showSuccess(
            <>
              <strong>{deletedItem.transactionAttribute}</strong> has been successfully deleted.
            </>
          );
        } else {
          showError(
            <>
              Failed to delete <strong>{deletedItem.transactionAttribute}</strong>. Please try again.
            </>
          );
        }
      }
    }
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setItemToDelete(null);
  };

  const handleAdd = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingItem(undefined);
  };

  const handleSave = async (transactionFieldData: TransactionFieldData) => {
    if (editingItem) {
      // Update existing transaction field via API
      try {
        const result = await updateTransactionField({
          productId,
          transactionAttribute: transactionFieldData.transactionAttribute,
          label: transactionFieldData.label,
          dataType: transactionFieldData.dataType,
          unitOfMeasure: transactionFieldData.unitOfMeasure,
          displaySequence: transactionFieldData.displaySequence,
          required: transactionFieldData.required,
          negativeAllowed: transactionFieldData.negativeAllowed,
          summarization: transactionFieldData.summarization,
          accountUsage: transactionFieldData.accountUsage,
          calculated: transactionFieldData.calculated || false,
          notes: transactionFieldData.notes || ''
        });

        // Update local data
        setData((prevData) =>
          prevData.map((item) => (item.transactionAttribute === editingItem.transactionAttribute ? result : item))
        );

        showSuccess(
          <>
            <strong>{transactionFieldData.transactionAttribute}</strong> has been successfully updated.
          </>
        );
        handleDialogClose();
      } catch (error) {
        // Error is now immediately available
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to update transaction field. Please try again.';
        showError(errorMessage);
      }
      return;
    } else {
      // Create new transaction field via API
      try {
        await createTransactionField({
          productId,
          transactionAttribute: transactionFieldData.transactionAttribute,
          label: transactionFieldData.label,
          dataType: transactionFieldData.dataType,
          unitOfMeasure: transactionFieldData.unitOfMeasure,
          displaySequence: transactionFieldData.displaySequence,
          required: transactionFieldData.required,
          negativeAllowed: transactionFieldData.negativeAllowed,
          summarization: transactionFieldData.summarization,
          accountUsage: transactionFieldData.accountUsage,
          calculated: transactionFieldData.calculated || false,
          notes: transactionFieldData.notes || ''
        });

        // Add to local data
        setData((prevData) => [transactionFieldData, ...prevData]);
        setCurrentPage(1);

        showSuccess(
          <>
            <strong>{transactionFieldData.transactionAttribute}</strong> has been successfully created.
          </>
        );
        handleDialogClose();
      } catch (error) {
        // Error is now immediately available
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create transaction field. Please try again.';
        showError(errorMessage);
      }
      return;
    }

    handleDialogClose();
  };

  return (
    <Container maxWidth="xl" sx={{py: 3}}>
      <Box sx={{mb: 3}}>
        <TransactionFieldsOverviewCard
          data={paginatedData}
          totalItems={totalItems}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          showFilters={false}
          isLoading={isLoadingData}
        />
      </Box>

      <TransactionFieldDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
        initialData={editingItem}
        isSaving={isSaving}
      />

      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Container>
  );
}

export default TransactionFieldsPage;
