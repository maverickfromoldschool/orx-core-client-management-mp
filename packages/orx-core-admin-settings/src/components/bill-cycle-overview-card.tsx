import React from 'react';
import {Box, Card, Typography} from '@mui/material';

import type {BillPeriodOption} from '../services';

import {BillCycleTable} from './bill-cycle-table';
import {type BillCycleData} from './bill-cycle-types';
import {UomActionBar} from './uom-action-bar';
import {Pagination} from './pagination';

export interface BillCycleOverviewCardProps {
  data: BillCycleData[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onRowClick: (item: BillCycleData) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onFiltersClick: () => void;
  isLoading?: boolean;
  billingPeriodOptions: BillPeriodOption[];
}

export function BillCycleOverviewCard({
  data,
  totalItems,
  currentPage,
  totalPages,
  onRowClick,
  onEdit,
  onDelete,
  onPageChange,
  onAdd,
  onFiltersClick,
  isLoading = false,
  billingPeriodOptions
}: BillCycleOverviewCardProps) {
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
          Bill Cycle Overview
        </Typography>
      </Box>

      {/* Action Bar */}
      <Box sx={{px: 3}}>
        <UomActionBar totalItems={totalItems} onAdd={onAdd} onFiltersClick={onFiltersClick} />
      </Box>

      {/* Bill Cycle Table */}
      <Box sx={{px: 3}}>
        <BillCycleTable
          data={data}
          onRowClick={onRowClick}
          onEdit={onEdit}
          onDelete={onDelete}
          isLoading={isLoading}
          onAddBillCycle={onAdd}
          billingPeriodOptions={billingPeriodOptions}
        />
      </Box>

      {/* Pagination */}
      <Box sx={{px: 3, pb: 2}}>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </Box>
    </Card>
  );
}
