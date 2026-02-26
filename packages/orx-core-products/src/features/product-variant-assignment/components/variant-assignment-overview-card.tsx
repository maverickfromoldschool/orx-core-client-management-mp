import React from 'react';
import {Box, Card} from '@mui/material';

import {VariantAssignment} from '../types';

import {VariantAssignmentActionBar, type BulkAction} from './variant-assignment-action-bar';
import {VariantAssignmentTable} from './variant-assignment-table';
import {Pagination} from './pagination';

/**
 * Props for VariantAssignmentOverviewCard component
 */
export interface VariantAssignmentOverviewCardProps {
  /** Array of variant assignment data to display */
  variantAssignments: VariantAssignment[];
  /** Total number of variant assignments */
  totalCount: number;
  /** Currently selected variant assignment IDs */
  selectedIds: string[];
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether data is loading */
  loading?: boolean;
  /** Callback when selection changes */
  onSelectionChange: (ids: string[]) => void;
  /** Callback when edit action is clicked */
  onEdit: (assignment: VariantAssignment) => void;
  /** Callback when delete action is clicked */
  onDelete: (assignment: VariantAssignment) => void;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when Assign Variants button is clicked */
  onAssignVariants: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
  /** Callback when bulk action is applied */
  onBulkAction: (action: BulkAction) => void;
  /** Whether bulk actions are disabled */
  bulkActionsDisabled?: boolean;
}

/**
 * VariantAssignmentOverviewCard component
 * Displays the variant assignment table within a card container with action bar and pagination controls.
 * Follows the same pattern as VariantsOverviewCard and ClientsOverviewCard.
 *
 * Requirements: 1.x, 2.x, 3.x, 4.x, 5.x, 6.x, 7.x, 8.x
 */
export const VariantAssignmentOverviewCard: React.FC<VariantAssignmentOverviewCardProps> = ({
  variantAssignments,
  totalCount,
  selectedIds,
  currentPage,
  totalPages,
  loading = false,
  onSelectionChange,
  onEdit,
  onDelete,
  onPageChange,
  onAssignVariants,
  onFiltersClick,
  onBulkAction,
  bulkActionsDisabled = false
}) => {
  return (
    <Card
      sx={{
        boxShadow: 'none',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <VariantAssignmentActionBar
          totalCount={totalCount}
          onAssignVariants={onAssignVariants}
          onFiltersClick={onFiltersClick}
          onBulkAction={onBulkAction}
          bulkActionsDisabled={bulkActionsDisabled}
        />
      </Box>

      {/* Variant Assignment Table */}
      <Box sx={{px: 3}}>
        <VariantAssignmentTable
          variantAssignments={variantAssignments}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{px: 3, pb: 2}}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} loading={loading} />
      </Box>
    </Card>
  );
};
