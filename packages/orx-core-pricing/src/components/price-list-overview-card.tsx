import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import type {PriceListSummary} from '../services';

import {PriceListActionBar} from './price-list-action-bar';
import {PriceListTable} from './price-list-table';
import {Pagination} from './pagination';

/**
 * Props for the PriceListOverviewCard component
 */
export interface PriceListOverviewCardProps {
  /** Array of price list data to display */
  data: PriceListSummary[];
  /** Total number of items */
  totalItems: number;
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when view action is clicked */
  onView: (priceListId: string) => void;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
}

/**
 * PriceListOverviewCard component displays the price list table within a card container
 * with action bar and pagination controls.
 */
export const PriceListOverviewCard: React.FC<PriceListOverviewCardProps> = ({
  data,
  totalItems,
  currentPage,
  totalPages,
  isLoading = false,
  onView,
  onPageChange,
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
          Price List Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <PriceListActionBar totalItems={totalItems} onFiltersClick={onFiltersClick} />
      </Box>

      {/* Price List Table */}
      <Box sx={{px: 3}}>
        <PriceListTable data={data} onView={onView} isLoading={isLoading} />
      </Box>

      {/* Pagination */}
      <Box sx={{px: 3, pb: 2}}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </Card>
  );
};

export default PriceListOverviewCard;
