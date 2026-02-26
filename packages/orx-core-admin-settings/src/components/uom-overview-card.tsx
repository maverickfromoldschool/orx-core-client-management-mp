import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import {UomActionBar} from './uom-action-bar';
import {UomTable, type UnitOfMeasureData} from './uom-table';
import {Pagination} from './pagination';

/**
 * Props for the UomOverviewCard component
 */
export interface UomOverviewCardProps {
  /** Array of UOM data to display */
  data: UnitOfMeasureData[];
  /** Total number of items */
  totalItems: number;
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when row is clicked */
  onRowClick: (item: UnitOfMeasureData) => void;
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
}

/**
 * UomOverviewCard component displays the UOM table within a card container
 * with action bar and pagination controls.
 */
export const UomOverviewCard: React.FC<UomOverviewCardProps> = ({
  data,
  totalItems,
  currentPage,
  totalPages,
  isLoading = false,
  onRowClick,
  onEdit,
  onDelete,
  onPageChange,
  onAdd,
  onFiltersClick
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
          Unit of Measure
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <UomActionBar totalItems={totalItems} onAdd={onAdd} onFiltersClick={onFiltersClick} />
      </Box>

      {/* UOM Table */}
      <Box sx={{px: 3}}>
        <UomTable data={data} onRowClick={onRowClick} onEdit={onEdit} onDelete={onDelete} isLoading={isLoading} />
      </Box>

      {/* Pagination */}
      {!isLoading && totalPages > 0 && (
        <Box sx={{px: 3, pb: 3, pt: 2}}>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </Box>
      )}
    </Card>
  );
};

export default UomOverviewCard;
