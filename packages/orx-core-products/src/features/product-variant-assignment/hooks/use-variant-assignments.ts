/* eslint-disable @typescript-eslint/no-floating-promises */
import {useState, useCallback, useEffect} from 'react';

import {
  VariantAssignment,
  VariantAssignmentFormData,
  VariantAssignmentFilters,
  VariantAssignmentResponse
} from '../types';
import {categorizeError, formatBulkErrorMessage, CategorizedError} from '../utils/error-utils';

import {useVariantAssignmentSelection} from './use-variant-assignment-selection';
import {useVariantAssignmentFilters} from './use-variant-assignment-filters';

/**
 * Hook for managing variant assignment state and operations
 *
 * This is the main orchestration hook that manages all state for the Product Variant Assignment feature.
 * It integrates selection, filter, and form hooks, and provides handlers for all CRUD operations.
 *
 * Requirements: All requirements (orchestration)
 * - Manages variant assignments data and pagination
 * - Handles loading and error states
 * - Manages dialog and drawer visibility
 * - Provides CRUD operation handlers
 * - Integrates selection, filter, and form hooks
 */

export interface UseVariantAssignmentsOptions {
  /**
   * Product ID for which to manage variant assignments
   */
  productId: string;

  /**
   * Product Group (e.g., 'CORE') for fetching variants from product group
   */
  productGroup: string;

  /**
   * Initial page number (default: 1)
   */
  initialPage?: number;

  /**
   * Page size for pagination (default: 10)
   */
  pageSize?: number;

  /**
   * Callback to fetch variant assignments
   */
  onFetchAssignments: (
    productId: string,
    page: number,
    pageSize: number,
    filters: VariantAssignmentFilters
  ) => Promise<VariantAssignmentResponse>;

  /**
   * Callback to create a new variant assignment
   */
  onCreateAssignment: (productId: string, data: VariantAssignmentFormData) => Promise<VariantAssignment>;

  /**
   * Callback to update an existing variant assignment
   */
  onUpdateAssignment: (productId: string, id: string, data: VariantAssignmentFormData) => Promise<VariantAssignment>;

  /**
   * Callback to delete a variant assignment
   */
  onDeleteAssignment: (productId: string, id: string) => Promise<void>;

  /**
   * Callback to bulk delete variant assignments
   */
  onBulkDeleteAssignments: (productId: string, ids: string[]) => Promise<{successCount: number; failedIds: string[]}>;

  /**
   * Callback for navigation back
   */
  onBack?: () => void;

  /**
   * Callback for cancel action
   */
  onCancel?: () => void;
}

export const useVariantAssignments = (options: UseVariantAssignmentsOptions) => {
  const {
    productId,
    initialPage = 1,
    pageSize = 10,
    onFetchAssignments,
    onCreateAssignment,
    onUpdateAssignment,
    onDeleteAssignment,
    onBulkDeleteAssignments,
    onBack,
    onCancel
  } = options;

  // Data state
  const [variantAssignments, setVariantAssignments] = useState<VariantAssignment[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Loading and error state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<CategorizedError | null>(null);

  // Dialog and drawer state
  const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingAssignment, setEditingAssignment] = useState<VariantAssignment | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteTarget, setDeleteTarget] = useState<'single' | 'bulk'>('single');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Integrate selection hook
  const selection = useVariantAssignmentSelection();

  // Integrate filters hook
  const filterHook = useVariantAssignmentFilters();

  /**
   * Fetch variant assignments from API
   * Requirements: 1.1, 2.1, 8.4, 11.1, 11.2, 12.1
   */
  const fetchVariantAssignments = useCallback(
    async (page: number, filters: VariantAssignmentFilters) => {
      setLoading(true);
      setError(null);

      try {
        const response = await onFetchAssignments(productId, page, pageSize, filters);
        setVariantAssignments(response.data);
        setTotalCount(response.totalCount);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
      } catch (err) {
        const categorizedError = categorizeError(err);
        setError(categorizedError);
        console.error('Error fetching variant assignments:', err);
      } finally {
        setLoading(false);
      }
    },
    [productId, pageSize, onFetchAssignments]
  );

  /**
   * Load initial data and refresh when filters or page change
   */
  useEffect(() => {
    fetchVariantAssignments(currentPage, filterHook.filters).catch((err: unknown) => {
      console.error('Failed to fetch variant assignments:', err);
    });
  }, [currentPage, filterHook.filters, fetchVariantAssignments]);

  /**
   * Handle page change
   * Requirements: 2.3, 3.4
   */
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      // Clear selections when page changes (Requirement 3.4)
      selection.clearSelection();
    },
    [selection]
  );

  /**
   * Open create dialog
   * Requirement: 4.1
   */
  const openCreateDialog = useCallback(() => {
    setFormMode('create');
    setEditingAssignment(null);
    setFormDialogOpen(true);
  }, []);

  /**
   * Open edit dialog with pre-populated data
   * Requirement: 5.1
   */
  const openEditDialog = useCallback((assignment: VariantAssignment) => {
    setFormMode('edit');
    setEditingAssignment(assignment);
    setFormDialogOpen(true);
  }, []);

  /**
   * Close form dialog
   * Requirements: 5.4, 9.2
   */
  const closeFormDialog = useCallback(() => {
    setFormDialogOpen(false);
    setFormMode('create');
    setEditingAssignment(null);
  }, []);

  /**
   * Handle create assignment
   * Requirements: 4.5, 11.1, 11.2, 12.2
   */
  const handleCreateAssignment = useCallback(
    async (data: VariantAssignmentFormData) => {
      try {
        await onCreateAssignment(productId, data);
        closeFormDialog();
        // Refresh the current page
        await fetchVariantAssignments(currentPage, filterHook.filters);
      } catch (err) {
        const categorizedError = categorizeError(err);
        setError(categorizedError);
        throw err; // Re-throw to let form handle it
      }
    },
    [productId, currentPage, filterHook.filters, onCreateAssignment, closeFormDialog, fetchVariantAssignments]
  );

  /**
   * Handle update assignment
   * Requirements: 5.3, 11.1, 11.2, 12.2
   */
  const handleUpdateAssignment = useCallback(
    async (data: VariantAssignmentFormData) => {
      if (!editingAssignment) {
        throw new Error('No assignment selected for editing');
      }

      try {
        await onUpdateAssignment(productId, editingAssignment.id, data);
        closeFormDialog();
        // Refresh the current page
        await fetchVariantAssignments(currentPage, filterHook.filters);
      } catch (err) {
        const categorizedError = categorizeError(err);
        setError(categorizedError);
        throw err; // Re-throw to let form handle it
      }
    },
    [
      productId,
      editingAssignment,
      currentPage,
      filterHook.filters,
      onUpdateAssignment,
      closeFormDialog,
      fetchVariantAssignments
    ]
  );

  /**
   * Open delete confirmation dialog
   * Requirement: 6.1
   */
  const openDeleteDialog = useCallback((id: string, type: 'single' | 'bulk' = 'single') => {
    setDeleteId(id);
    setDeleteTarget(type);
    setDeleteDialogOpen(true);
  }, []);

  /**
   * Close delete confirmation dialog
   * Requirement: 6.3
   */
  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteTarget('single');
  }, []);

  /**
   * Handle delete single assignment
   * Requirements: 6.2, 6.4, 11.1, 11.2
   */
  const handleDeleteAssignment = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await onDeleteAssignment(productId, id);
        closeDeleteDialog();
        // Refresh the current page
        await fetchVariantAssignments(currentPage, filterHook.filters);
        return true; // Return success
      } catch (err) {
        const categorizedError = categorizeError(err);
        setError(categorizedError);
        console.error('Error deleting variant assignment:', err);
        return false; // Return failure
      }
    },
    [productId, currentPage, filterHook.filters, onDeleteAssignment, closeDeleteDialog, fetchVariantAssignments]
  );

  /**
   * Handle bulk delete assignments
   * Requirements: 7.3, 7.4, 7.5, 7.6, 11.1, 11.2, 11.4, 12.3
   */
  const handleBulkDeleteAssignments = useCallback(
    async (ids: string[]): Promise<{success: boolean; successCount: number; failedIds: string[]}> => {
      try {
        const result = await onBulkDeleteAssignments(productId, ids);
        closeDeleteDialog();

        // Clear selections after successful bulk action (Requirement 7.5)
        selection.clearSelection();

        // Refresh the current page
        await fetchVariantAssignments(currentPage, filterHook.filters);

        // Handle partial failures (Requirements 7.6, 11.4)
        if (result.failedIds.length > 0) {
          const errorMessage = formatBulkErrorMessage(result.successCount, result.failedIds, ids.length);
          setError({
            type: 'api',
            message: errorMessage,
            canRetry: false
          });
        }

        return {success: true, successCount: result.successCount, failedIds: result.failedIds};
      } catch (err) {
        const categorizedError = categorizeError(err);
        setError(categorizedError);
        console.error('Error bulk deleting variant assignments:', err);
        return {success: false, successCount: 0, failedIds: ids};
      }
    },
    [
      productId,
      currentPage,
      filterHook.filters,
      onBulkDeleteAssignments,
      closeDeleteDialog,
      selection,
      fetchVariantAssignments
    ]
  );

  /**
   * Confirm delete action (single or bulk)
   */
  const confirmDelete = useCallback(async (): Promise<{success: boolean; count: number; target: 'single' | 'bulk'}> => {
    if (deleteTarget === 'single' && deleteId) {
      const success = await handleDeleteAssignment(deleteId);
      return {success, count: success ? 1 : 0, target: 'single'};
    } else if (deleteTarget === 'bulk') {
      const result = await handleBulkDeleteAssignments(selection.selectedIds);
      return {success: result.success, count: result.successCount, target: 'bulk'};
    }
    return {success: false, count: 0, target: 'single'};
  }, [deleteTarget, deleteId, selection.selectedIds, handleDeleteAssignment, handleBulkDeleteAssignments]);

  /**
   * Open filter drawer
   * Requirement: 8.1
   */
  const openFilterDrawer = useCallback(() => {
    setFilterDrawerOpen(true);
  }, []);

  /**
   * Close filter drawer
   */
  const closeFilterDrawer = useCallback(() => {
    setFilterDrawerOpen(false);
  }, []);

  /**
   * Apply filters and reset to page 1
   * Requirements: 8.4, 8.7
   */
  const handleApplyFilters = useCallback(
    (filters: VariantAssignmentFilters) => {
      filterHook.applyFilters(filters);
      // Reset to page 1 when filters are applied (Requirement 8.7)
      setCurrentPage(1);
      closeFilterDrawer();
    },
    [filterHook, closeFilterDrawer]
  );

  /**
   * Clear all filters
   * Requirement: 8.6
   */
  const handleClearFilters = useCallback(() => {
    filterHook.clearFilters();
    setCurrentPage(1);
  }, [filterHook]);

  /**
   * Handle back navigation
   * Requirement: 9.1
   */
  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

  /**
   * Handle cancel action
   * Requirement: 9.2
   */
  const handleCancel = useCallback(() => {
    onCancel?.();
  }, [onCancel]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data state
    variantAssignments,
    totalCount,
    currentPage,
    totalPages,
    loading,
    error,

    // Selection state and actions
    selectedIds: selection.selectedIds,
    selectAll: selection.selectAll,
    selectedCount: selection.selectedCount,
    isBulkActionsEnabled: selection.isBulkActionsEnabled,
    toggleSelection: selection.toggleSelection,
    toggleSelectAll: selection.toggleSelectAll,
    clearSelection: selection.clearSelection,
    setSelectedIds: selection.setSelectedIds,

    // Filter state and actions
    filters: filterHook.filters,
    hasActiveFilters: filterHook.hasActiveFilters,
    applyFilters: handleApplyFilters,
    clearFilters: handleClearFilters,

    // Dialog and drawer state
    formDialogOpen,
    formMode,
    editingAssignment,
    filterDrawerOpen,
    deleteDialogOpen,
    deleteTarget,
    deleteCount: deleteTarget === 'bulk' ? selection.selectedCount : 1,

    // CRUD operations
    createAssignment: handleCreateAssignment,
    updateAssignment: handleUpdateAssignment,
    deleteAssignment: handleDeleteAssignment,
    bulkDeleteAssignments: handleBulkDeleteAssignments,

    // Dialog and drawer actions
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    openDeleteDialog,
    closeDeleteDialog,
    confirmDelete,
    openFilterDrawer,
    closeFilterDrawer,

    // Navigation actions
    handleBack,
    handleCancel,
    handlePageChange,

    // Utility actions
    clearError,
    refreshData: async () => fetchVariantAssignments(currentPage, filterHook.filters)
  };
};
