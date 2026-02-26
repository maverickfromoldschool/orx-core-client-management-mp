import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import {LookupActionBar} from './lookup-action-bar';
// import type {BulkAction} from './lookup-action-bar';
import {AttributeTable} from './attribute-table';
import type {AttributeData} from './attribute-types';
import {Pagination} from './pagination';

/**
 * Props for the AttributeOverviewCard component
 */
export interface AttributeOverviewCardProps {
  /** Array of attribute data to display */
  data: AttributeData[];
  /** Total number of items */
  totalItems: number;
  /** Currently selected item IDs */
  selectedIds: string[];
  /** Current page number (0-indexed for state, converted to 1-indexed for UI) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether data is loading */
  isLoading?: boolean;
  // /** Callback when selection changes */
  // onSelectionChange: (selectedIds: string[]) => void;
  /** Callback when row is clicked */
  onRowClick: (item: AttributeData) => void;
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
 * AttributeOverviewCard component displays the attribute table within a card container
 * with action bar and pagination controls.
 */
export const AttributeOverviewCard: React.FC<AttributeOverviewCardProps> = ({
  data,
  totalItems,
  selectedIds,
  currentPage,
  totalPages,
  isLoading = false,
  // onSelectionChange, // TODO: Implement selection
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
          Attribute Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <LookupActionBar totalItems={totalItems} onAdd={onAdd} onFiltersClick={onFiltersClick} />
      </Box>

      {/* Attribute Table */}
      <Box sx={{px: 3}}>
        <AttributeTable
          data={data}
          selectedIds={selectedIds}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
          onAddAttribute={onAdd}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{px: 3, pb: 2}}>
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(page) => {
            onPageChange(page - 1);
          }}
        />
      </Box>
    </Card>
  );
};

export default AttributeOverviewCard;
