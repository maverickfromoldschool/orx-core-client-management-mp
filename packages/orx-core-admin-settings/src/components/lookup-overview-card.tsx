import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import {LookupActionBar} from './lookup-action-bar';
// import type {BulkAction} from './lookup-action-bar';
import {LookupTable, type LookupData} from './lookup-table';
import {Pagination} from './pagination';

/**
 * Props for the LookupOverviewCard component
 */
export interface LookupOverviewCardProps {
  /** Array of lookup data to display */
  data: LookupData[];
  /** Total number of items */
  totalItems: number;
  /** Currently selected item IDs */
  selectedIds: string[];
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Callback when row is clicked */
  onRowClick: (item: LookupData) => void;
  /** Callback when edit action is clicked */
  onEdit: (itemId: string) => void;
  /** Callback when delete action is clicked */
  onDelete: (itemId: string) => void;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when Add New button is clicked */
  onAdd: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
  // /** Callback when bulk action is applied */
  // onBulkAction: (action: BulkAction) => void;
}

/**
 * LookupOverviewCard component displays the lookup table within a card container
 * with action bar and pagination controls.
 */
export const LookupOverviewCard: React.FC<LookupOverviewCardProps> = ({
  data,
  totalItems,
  selectedIds,
  currentPage,
  totalPages,
  isLoading = false,
  onSelectionChange,
  onRowClick,
  onEdit,
  onDelete,
  onPageChange,
  onAdd,
  onFiltersClick
  // onBulkAction // TODO: Implement bulk actions
}) => {
  return (
    <Card
      sx={{
        borderRadius: '12px',
        border: '1px solid #CBCCCD',
        boxShadow: 'none',
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Card Header with Title */}
      <Box sx={{px: 3, pt: 3}}>
        <Typography
          variant="h2"
          sx={{
            fontSize: '20px',
            fontWeight: 700,
            color: '#002677',
            fontFamily: '"Enterprise Sans VF", sans-serif'
          }}
        >
          Lookup Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <LookupActionBar totalItems={totalItems} onAdd={onAdd} onFiltersClick={onFiltersClick} />
      </Box>

      {/* Lookup Table */}
      <Box sx={{px: 3}}>
        <LookupTable
          data={data}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
          onAddLookup={onAdd}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{px: 3, pb: 2}}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </Card>
  );
};

export default LookupOverviewCard;
