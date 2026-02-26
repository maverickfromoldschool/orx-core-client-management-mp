import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import {Container} from '@mui/system';

import {AccountingCodeList} from '../../components/accounting-codes/AccountingCodeList';
import {AddAccountingCodeDialog} from '../../components/accounting-codes/AddAccountingCodeDialog';
import {EditAccountingCodeDialog} from '../../components/accounting-codes/EditAccountingCodeDialog';
import {FilterDialog} from '../../components/accounting-codes/AccountingCodeList/FilterDialog';
import {useAccountingCodePage} from '../useAccountingCodePage/use-accounting-code-page';

export function AccountingCodePage() {
  const {
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
  } = useAccountingCodePage();

  return (
    <Container maxWidth="xl" sx={{py: 3}}>
      <AccountingCodeList
        data={data}
        loading={loading}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onCreateNew={handleCreateNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFilter={handleFilter}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        glAccountTypes={glAccountTypes}
        glAccountGroups={glAccountGroups}
        glAccountingKeyPlugins={glAccountingKeyPlugins}
      />

      <AddAccountingCodeDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
        loading={dialogLoading}
        glAccountTypes={glAccountTypes}
        glAccountGroups={glAccountGroups}
        glAccountingKeyPlugins={glAccountingKeyPlugins}
      />

      {editDialogOpen && editFormData && (
        <EditAccountingCodeDialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          onSubmit={handleEditDialogSubmit}
          data={editFormData}
          loading={editDialogLoading}
          glAccountTypes={glAccountTypes}
          glAccountGroups={glAccountGroups}
          glAccountingKeyPlugins={glAccountingKeyPlugins}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-accounting-code-title"
        aria-describedby="delete-accounting-code-description"
      >
        <DialogTitle id="delete-accounting-code-title">Delete accounting code</DialogTitle>
        <DialogContent>
          <Typography id="delete-accounting-code-description">
            Are you sure you want to delete accounting code &quot;{rowToDelete?.accountingCode ?? ''}&quot;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <FilterDialog
        open={filterDialogOpen}
        onClose={handleFilterDialogClose}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
        initialValues={filterValues}
      />
    </Container>
  );
}

export default AccountingCodePage;
