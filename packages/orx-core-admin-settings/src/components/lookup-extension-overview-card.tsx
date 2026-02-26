import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import {LookupActionBar} from './lookup-action-bar';
// import type {BulkAction} from './lookup-action-bar';
import type {TableColumn} from './lookup-extension-table';
import {Pagination} from './pagination';
import LookupExtensionTable from './lookup-extension-table';

/**
 * Props for the LookupOverviewCard component
 */
export interface LookupExtensionOverviewCardProps {
  /** Array of lookup data to display (raw API records) */
  data: Record<string, unknown>[];
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
  /** Callback when edit action is clicked */
  onEdit: (item: Record<string, unknown>) => void;
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
  /** Optional consumer-provided column definitions forwarded to LookupTable */
  columns?: TableColumn[];
}

/**
 * LookupOverviewCard component displays the lookup table within a card container
 * with action bar and pagination controls.
 */
export const LookupExtensionOverviewCard: React.FC<LookupExtensionOverviewCardProps> = ({
  data,
  totalItems,
  selectedIds,
  currentPage,
  totalPages,
  isLoading = false,
  onSelectionChange,
  onEdit,
  onDelete,
  onPageChange,
  onAdd,
  onFiltersClick,
  // onBulkAction, // TODO: Implement bulk actions
  columns
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
          Lookup Extension Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <LookupActionBar totalItems={totalItems} onAdd={onAdd} onFiltersClick={onFiltersClick} />
      </Box>

      {/* Lookup Table */}
      <Box sx={{px: 3}}>
        <LookupExtensionTable
          data={data as any}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
          onAddLookup={onAdd}
          columns={columns}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{px: 3, pb: 2}}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </Card>
  );
};

export default LookupExtensionOverviewCard;
