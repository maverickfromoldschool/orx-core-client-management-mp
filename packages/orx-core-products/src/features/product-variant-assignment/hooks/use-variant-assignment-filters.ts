import {useState, useCallback, useMemo} from 'react';

import {VariantAssignmentFilters} from '../types';

/**
 * Hook for managing variant assignment filter state
 *
 * This hook provides state and actions for managing filters in the variant assignment feature.
 * It supports setting individual filters, applying filters, clearing filters, and tracking
 * whether any filters are currently active.
 *
 * Requirements:
 * - 8.1: Open filter panel/dialog
 * - 8.2: Filter by boolean attributes (Predefined List, Transaction Processing, Price Determination)
 * - 8.3: Filter by date ranges
 * - 8.4: Apply filters to update table
 * - 8.5: Display visual indicator when filters are active
 * - 8.6: Clear all filters to reset table
 */
export const useVariantAssignmentFilters = () => {
  const [filters, setFilters] = useState<VariantAssignmentFilters>({
    transactionProcessing: null,
    priceDetermination: null,
    startDateFrom: null,
    startDateTo: null,
    endDateFrom: null,
    endDateTo: null
  });

  /**
   * Check if any filters are currently active
   * Requirement 8.5: Display visual indicator when filters are active
   *
   * A filter is considered active if it has a non-null value
   */
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some((value) => value !== null);
  }, [filters]);

  /**
   * Set a single filter value
   * Requirements 8.2, 8.3: Filter by boolean attributes and date ranges
   *
   * @param key - The filter key to update
   * @param value - The new value for the filter
   */
  const setFilter = useCallback((key: keyof VariantAssignmentFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  /**
   * Apply filters by replacing the entire filter state
   * Requirement 8.4: Apply filters to update table
   *
   * This is typically called when the user clicks "Apply" in the filter drawer
   *
   * @param newFilters - The complete filter object to apply
   */
  const applyFilters = useCallback((newFilters: VariantAssignmentFilters) => {
    setFilters(newFilters);
  }, []);

  /**
   * Clear all filters and reset to empty state
   * Requirement 8.6: Clear all filters to reset table
   */
  const clearFilters = useCallback(() => {
    setFilters({
      transactionProcessing: null,
      priceDetermination: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null
    });
  }, []);

  /**
   * Reset filters to a specific state (useful for external control)
   *
   * @param initialFilters - The filter state to reset to
   */
  const resetFilters = useCallback(
    (initialFilters?: VariantAssignmentFilters) => {
      if (initialFilters) {
        setFilters(initialFilters);
      } else {
        clearFilters();
      }
    },
    [clearFilters]
  );

  return {
    filters,
    hasActiveFilters,
    setFilter,
    applyFilters,
    clearFilters,
    resetFilters
  };
};
