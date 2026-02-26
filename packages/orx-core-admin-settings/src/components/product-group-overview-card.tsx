import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import {LookupActionBar} from './lookup-action-bar';
// import type {BulkAction} from './lookup-action-bar';
import {ProductGroupTable} from './product-group-table';
import type {ProductGroupData} from './product-group-types';
import {Pagination} from './pagination';

/**
 * Dropdown option format
 */
interface DropdownOption {
  label: string;
  value: string;
}

/**
 * Props for the ProductGroupOverviewCard component
 */
export interface ProductGroupOverviewCardProps {
  /** Array of product group data to display */
  data: ProductGroupData[];
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
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Callback when row is clicked */
  onRowClick: (item: ProductGroupData) => void;
  /** Callback when edit action is clicked */
  onEdit: (itemId: string) => void;
  /** Callback when delete action is clicked */
  onDelete: (itemId: string) => void;
  /** Callback when copy action is clicked */
  onCopy: (itemId: string) => void;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Callback when Add New button is clicked */
  onAdd: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
  // /** Callback when bulk action is applied */
  // onBulkAction: (action: BulkAction) => void;
  /** Product category options for display name mapping */
  productCategoryOptions?: DropdownOption[];
  /** External system options for display name mapping */
  externalSystemOptions?: DropdownOption[];
}

/**
 * ProductGroupOverviewCard component displays the product group table within a card container
 * with action bar and pagination controls.
 */
export const ProductGroupOverviewCard: React.FC<ProductGroupOverviewCardProps> = ({
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
  onCopy,
  onPageChange,
  onAdd,
  onFiltersClick,
  // onBulkAction, // TODO: Implement bulk actions
  productCategoryOptions = [],
  externalSystemOptions = []
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
          Product Group Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <LookupActionBar totalItems={totalItems} onAdd={onAdd} onFiltersClick={onFiltersClick} />
      </Box>

      {/* Product Group Table */}
      <Box sx={{px: 3}}>
        <ProductGroupTable
          data={data}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          onCopy={onCopy}
          isLoading={isLoading}
          onAddProductGroup={onAdd}
          productCategoryOptions={productCategoryOptions}
          externalSystemOptions={externalSystemOptions}
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

export default ProductGroupOverviewCard;
