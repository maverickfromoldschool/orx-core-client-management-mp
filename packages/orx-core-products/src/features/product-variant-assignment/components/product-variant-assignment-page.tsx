import React from 'react';
import {Box, Container} from '@mui/material';
import {useNotification} from '@optum-rx-core/orx-core-notification';

import {useVariantAssignments, UseVariantAssignmentsOptions} from '../hooks/use-variant-assignments';
import {VariantAssignment, VariantAssignmentFormData} from '../types';

import {VariantAssignmentHeader} from './variant-assignment-header';
import {VariantAssignmentOverviewCard} from './variant-assignment-overview-card';
import {type BulkAction} from './variant-assignment-action-bar';
import {VariantAssignmentFormDialog} from './variant-assignment-form-dialog';
import {VariantAssignmentFilterDrawer} from './variant-assignment-filter-drawer';
import {DeleteConfirmationDialog} from './delete-confirmation-dialog';
import {ErrorBoundary} from './error-boundary';

/**
 * ProductVariantAssignmentPage component
 * Main container component that orchestrates all child components for the Product Variant Assignment feature
 * Refactored to follow the same pattern as variants-page and client-list-page
 *
 * Features:
 * - Displays page header with navigation and cancel buttons
 * - Shows overview card with action bar, table, and pagination
 * - Manages create/edit form dialog
 * - Manages filter drawer
 * - Manages delete confirmation dialog
 * - Integrates useVariantAssignments hook for state management
 * - Uses notification hook for success/error messages
 *
 * Design:
 * - Background color: #FAFCFF (from Figma)
 * - Uses Container component for proper layout
 * - Card-based design with consistent styling
 * - Follows established coding patterns
 *
 * Requirements: All requirements (orchestration)
 * - 1.x: Display variant assignments in table
 * - 2.x: Pagination management
 * - 3.x: Row selection
 * - 4.x: Create variant assignment
 * - 5.x: Edit variant assignment
 * - 6.x: Delete variant assignment
 * - 7.x: Bulk actions
 * - 8.x: Filter variant assignments
 * - 9.x: Navigation and cancel
 * - 10.x: Accessibility compliance
 * - 11.x: Error handling
 * - 12.x: Loading states
 */
export const ProductVariantAssignmentPage: React.FC<UseVariantAssignmentsOptions> = (props) => {
  // Initialize the main hook with all state management
  const hook = useVariantAssignments(props);

  // Initialize notification hook
  const {showSuccess, showError} = useNotification();

  // Extract productGroup from props
  const {productGroup} = props;

  /**
   * Display error notification when error occurs
   */
  React.useEffect(() => {
    if (hook.error) {
      showError(hook.error.message || 'An error occurred. Please try again.');
    }
  }, [hook.error, showError]);

  /**
   * Handle selection change from table
   * DataGrid passes an array of selected IDs
   */
  const handleSelectionChange = (ids: string[]) => {
    // DataGrid provides the complete array of selected IDs
    hook.setSelectedIds(ids);
  };

  /**
   * Handle edit button click from table
   * Opens edit dialog with pre-populated data
   */
  const handleEdit = (assignment: VariantAssignment) => {
    hook.openEditDialog(assignment);
  };

  /**
   * Handle delete button click from table
   * Opens delete confirmation dialog for single item
   */
  const handleDelete = (assignment: VariantAssignment) => {
    hook.openDeleteDialog(assignment.id, 'single');
  };

  /**
   * Handle bulk action from action bar
   * Currently supports 'delete' action
   */
  const handleBulkAction = (action: BulkAction) => {
    if (action === 'delete') {
      hook.openDeleteDialog('', 'bulk');
    }
  };

  /**
   * Handle delete confirmation
   * Shows success notification after successful delete
   */
  const handleDeleteConfirm = async () => {
    const result = await hook.confirmDelete();
    if (result.success) {
      if (result.target === 'single') {
        showSuccess(<>Variant assignment has been successfully deleted.</>);
      } else {
        showSuccess(
          <>
            <strong>{result.count}</strong> variant assignment{result.count !== 1 ? 's' : ''}{' '}
            {result.count !== 1 ? 'have' : 'has'} been successfully deleted.
          </>
        );
      }
    }
  };

  /**
   * Handle form submission (create or edit)
   * Delegates to appropriate handler based on form mode
   * Shows success notification on completion
   */
  const handleFormSubmit = async (data: VariantAssignmentFormData) => {
    try {
      if (hook.formMode === 'create') {
        await hook.createAssignment(data);
        showSuccess(
          <>
            Variant assignment for <strong>{data.variantField}</strong> has been successfully created.
          </>
        );
      } else {
        await hook.updateAssignment(data);
        showSuccess(
          <>
            Variant assignment for <strong>{data.variantField}</strong> has been successfully updated.
          </>
        );
      }
    } catch (error) {
      // Error is handled by the hook and displayed via useEffect above
      console.error('Failed to save variant assignment:', error);
    }
  };

  /**
   * Get initial values for form dialog
   * Returns editing assignment data or undefined for create mode
   */
  const getFormInitialValues = () => {
    if (hook.formMode === 'edit' && hook.editingAssignment) {
      return {
        variantField: hook.editingAssignment.variantField,
        defaultValue: hook.editingAssignment.defaultValue,
        dataType: hook.editingAssignment.dataType,
        priorityOrder: String(hook.editingAssignment.priorityOrder), // Convert number to string for form
        transactionProcessing: hook.editingAssignment.transactionProcessing,
        priceDetermination: hook.editingAssignment.priceDetermination,
        startDate: hook.editingAssignment.startDate || '',
        endDate: hook.editingAssignment.endDate || '',
        variantValues: hook.editingAssignment.variantValues
      };
    }
    return undefined;
  };

  return (
    <ErrorBoundary onReset={hook.refreshData}>
      <Box
        component="main"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          px: '84px',
          py: 3
        }}
      >
        {/* Main Content Container */}
        <Container
          maxWidth="xl"
          sx={{
            py: 3,
            flex: 1
          }}
        >
          {/* Page Header with Back and Cancel buttons */}
          <div>
            <VariantAssignmentHeader onBack={hook.handleBack} onCancel={hook.handleCancel} />
          </div>

          {/* Overview Card with Table and Actions */}
          <Box sx={{mb: 3}}>
            <VariantAssignmentOverviewCard
              variantAssignments={hook.variantAssignments}
              totalCount={hook.totalCount}
              selectedIds={hook.selectedIds}
              currentPage={hook.currentPage}
              totalPages={hook.totalPages}
              loading={hook.loading}
              onSelectionChange={handleSelectionChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPageChange={hook.handlePageChange}
              onAssignVariants={hook.openCreateDialog}
              onFiltersClick={hook.openFilterDrawer}
              onBulkAction={handleBulkAction}
              bulkActionsDisabled={!hook.isBulkActionsEnabled}
            />
          </Box>
        </Container>

        {/* Create/Edit Form Dialog */}
        <VariantAssignmentFormDialog
          open={hook.formDialogOpen}
          mode={hook.formMode}
          productGroup={productGroup}
          initialValues={getFormInitialValues()}
          onClose={hook.closeFormDialog}
          onSubmit={handleFormSubmit}
          loading={hook.loading}
        />

        {/* Filter Drawer */}
        <VariantAssignmentFilterDrawer
          open={hook.filterDrawerOpen}
          onClose={hook.closeFilterDrawer}
          onApplyFilters={hook.applyFilters}
          initialFilters={hook.filters}
          loading={hook.loading}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={hook.deleteDialogOpen}
          count={hook.deleteCount}
          onConfirm={handleDeleteConfirm}
          onCancel={hook.closeDeleteDialog}
          loading={hook.loading}
        />
      </Box>
    </ErrorBoundary>
  );
};
