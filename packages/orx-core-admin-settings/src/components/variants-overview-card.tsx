import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import {VariantsTable} from './variants-table';
import {type VariantData} from './variant-dialog.types';
import {LookupActionBar} from './lookup-action-bar';
// import type {BulkAction} from './lookup-action-bar';
import {Pagination} from './pagination';

export interface VariantsOverviewCardProps {
  data: VariantData[];
  totalItems: number;
  selectedIds: string[];
  currentPage: number;
  totalPages: number;
  onSelectionChange: (ids: string[]) => void;
  onRowClick: (item: VariantData) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onFiltersClick: () => void;
  // onBulkAction: (action: BulkAction) => void;
  isLoading?: boolean;
}

export function VariantsOverviewCard({
  data,
  totalItems,
  selectedIds,
  currentPage,
  totalPages,
  onSelectionChange,
  onRowClick,
  onEdit,
  onDelete,
  onPageChange,
  onAdd,
  onFiltersClick,
  // onBulkAction, // TODO: Implement bulk actions
  isLoading = false
}: VariantsOverviewCardProps) {
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
          Variant Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <LookupActionBar totalItems={totalItems} onAdd={onAdd} onFiltersClick={onFiltersClick} />
      </Box>

      {/* Variants Table */}
      <Box sx={{px: 3}}>
        <VariantsTable
          data={data}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
          onAddVariant={onAdd}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{px: 3, pb: 2}}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </Card>
  );
}
