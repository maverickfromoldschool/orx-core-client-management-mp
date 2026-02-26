import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import {TransactionFieldsTable} from './transaction-fields-table';
import {type TransactionFieldData} from './transaction-field-dialog.types';
import {ActionBar} from './action-bar';

export interface TransactionFieldsOverviewCardProps {
  data: TransactionFieldData[];
  totalItems: number;
  onRowClick: (item: TransactionFieldData) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onFiltersClick?: () => void;
  showFilters?: boolean;
  isLoading?: boolean;
}

export function TransactionFieldsOverviewCard({
  data,
  totalItems,
  onRowClick,
  onEdit,
  onDelete,
  onAdd,
  onFiltersClick,
  showFilters = true,
  isLoading = false
}: TransactionFieldsOverviewCardProps) {
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
          Transaction Fields Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <ActionBar totalItems={totalItems} onAdd={onAdd} onFiltersClick={onFiltersClick} showFilters={showFilters} />
      </Box>

      {/* Transaction Fields Table */}
      <Box sx={{px: 3}}>
        <TransactionFieldsTable
          data={data}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
        />
      </Box>
    </Card>
  );
}
