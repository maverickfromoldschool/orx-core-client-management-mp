import {useState, useCallback} from 'react';

import {SelectionState} from '../types';

/**
 * Hook for managing variant assignment row selection state
 *
 * This hook provides state and actions for managing row selection in the variant assignment table.
 * It supports individual row selection, select-all functionality, and clearing selections.
 *
 * Requirements:
 * - 3.1: Toggle selection state for individual rows
 * - 3.2: Toggle selection for all rows on current page
 * - 3.4: Clear selections on page change
 * - 3.5: Enable bulk actions when rows are selected
 */
export const useVariantAssignmentSelection = () => {
  const [selectionState, setSelectionState] = useState<SelectionState>({
    selectedIds: [],
    selectAll: false
  });

  /**
   * Toggle selection state for a single row
   * Requirement 3.1: Toggle selection state for individual rows
   *
   * @param id - The ID of the variant assignment to toggle
   */
  const toggleSelection = useCallback((id: string) => {
    setSelectionState((prev) => {
      const isCurrentlySelected = prev.selectedIds.includes(id);

      if (isCurrentlySelected) {
        // Remove from selection
        const newSelectedIds = prev.selectedIds.filter((selectedId) => selectedId !== id);
        return {
          selectedIds: newSelectedIds,
          selectAll: false // Deselecting any row should uncheck select-all
        };
      } else {
        // Add to selection
        return {
          selectedIds: [...prev.selectedIds, id],
          selectAll: false // Individual selection doesn't set select-all
        };
      }
    });
  }, []);

  /**
   * Toggle selection for all rows on the current page
   * Requirement 3.2: Toggle selection for all rows on current page
   *
   * @param allIds - Array of all variant assignment IDs on the current page
   */
  const toggleSelectAll = useCallback((allIds: string[]) => {
    setSelectionState((prev) => {
      if (prev.selectAll) {
        // Deselect all
        return {
          selectedIds: [],
          selectAll: false
        };
      } else {
        // Select all
        return {
          selectedIds: [...allIds],
          selectAll: true
        };
      }
    });
  }, []);

  /**
   * Clear all selections
   * Requirement 3.4: Clear selections on page change
   */
  const clearSelection = useCallback(() => {
    setSelectionState({
      selectedIds: [],
      selectAll: false
    });
  }, []);

  /**
   * Set selected IDs directly (useful for external state management)
   *
   * @param ids - Array of variant assignment IDs to select
   */
  const setSelectedIds = useCallback((ids: string[]) => {
    setSelectionState({
      selectedIds: ids,
      selectAll: false
    });
  }, []);

  /**
   * Check if bulk actions should be enabled
   * Requirement 3.5: Enable bulk actions when rows are selected
   */
  const isBulkActionsEnabled = selectionState.selectedIds.length > 0;

  return {
    selectedIds: selectionState.selectedIds,
    selectAll: selectionState.selectAll,
    selectedCount: selectionState.selectedIds.length,
    isBulkActionsEnabled,
    toggleSelection,
    toggleSelectAll,
    clearSelection,
    setSelectedIds
  };
};
