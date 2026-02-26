import React from 'react';
import {
  Box,
  Checkbox,
  IconButton,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import type {BillPeriodOption} from '../services';

import {EmptyState} from './empty-state';
import {type BillCycleData} from './bill-cycle-types';

// Utility function to format date for display (date only)
const formatDateForDisplay = (dateString: string | undefined | null): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    // Return only the date part in YYYY-MM-DD format
    const parts = date.toISOString().split('T');
    return parts[0] || '';
  } catch {
    return '';
  }
};

export interface BillCycleTableProps {
  data: BillCycleData[];
  onRowClick: (item: BillCycleData) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  onAddBillCycle?: () => void;
  billingPeriodOptions: BillPeriodOption[];
}

/** Table column definitions */
const columns = [
  {id: 'billCycleCode', label: 'BillCycle', width: 150},
  {id: 'description', label: 'Description', width: 200},
  {id: 'billingPeriod', label: 'BillPeriod', width: 150},
  {id: 'dailyRefresh', label: 'Daily Reprocess', width: 150},
  {id: 'finalsReprocess', label: 'Final Reprocess', width: 150},
  {id: 'nextScheduleDttm', label: 'Next Cycle Date', width: 180},
  {id: 'status', label: 'Status', width: 120},
  {id: 'actions', label: 'Actions', width: 100}
];

export function BillCycleTable({
  data,
  onRowClick,
  onEdit,
  onDelete,
  isLoading = false,
  onAddBillCycle,
  billingPeriodOptions
}: BillCycleTableProps) {
  const handleRowClick = (item: BillCycleData) => (event: React.MouseEvent) => {
    event.preventDefault();
    onRowClick(item);
  };

  // Helper function to get billing period label
  const getBillingPeriodLabel = (value: string): string => {
    const option = billingPeriodOptions.find((opt) => opt.value === value);
    return option?.label || value;
  };

  // Loading skeleton rows
  if (isLoading) {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sx={{
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#323334',
                    borderBottom: '1px solid #CBCCCD',
                    width: column.width
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({length: 5}, (_, index) => index).map((rowIndex) => (
              <TableRow key={`skeleton-row-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#323334',
                  borderBottom: '1px solid #CBCCCD',
                  width: column.width
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {!Array.isArray(data) || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{borderBottom: 'none', padding: 0}}>
                <EmptyState
                  title="No bill cycles found"
                  actionText="adding a new bill cycle"
                  onAction={onAddBillCycle}
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              return (
                <TableRow
                  key={item.billCycleCode}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#F5F5F5'
                    }
                  }}
                >
                  {/* BillCycle Code cell */}
                  <TableCell
                    onClick={handleRowClick(item)}
                    sx={{
                      fontSize: '14px',
                      color: '#4B4D4F',
                      borderBottom: '1px solid #CBCCCD',
                      cursor: 'pointer',
                      fontWeight: 400,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    {item.billCycleCode}
                  </TableCell>

                  {/* Description cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {item.description}
                  </TableCell>

                  {/* Billing Period cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {getBillingPeriodLabel(item.billingPeriod)}
                  </TableCell>

                  {/* Daily Refresh cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    <Checkbox
                      checked={item.dailyRefresh === 'Y'}
                      disabled
                      sx={{
                        padding: 0,
                        '&.Mui-checked': {
                          color: '#002677'
                        }
                      }}
                    />
                  </TableCell>

                  {/* Finals Reprocess cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    <Checkbox
                      checked={item.finalsReprocess === 'Y'}
                      disabled
                      sx={{
                        padding: 0,
                        '&.Mui-checked': {
                          color: '#002677'
                        }
                      }}
                    />
                  </TableCell>

                  {/* Next Schedule Dttm cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {formatDateForDisplay(item.nextScheduleDttm)}
                  </TableCell>

                  {/* Status cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: '4px',
                        backgroundColor: '#FFFFFF',
                        color: '#007000',
                        border: '1px solid #007000',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      Active
                    </Box>
                  </TableCell>

                  {/* Actions cell */}
                  <TableCell sx={{borderBottom: '1px solid #CBCCCD'}}>
                    <Box sx={{display: 'flex', gap: 0.5}}>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item.billCycleCode);
                          }}
                          sx={{
                            color: '#0C55B8',
                            '&:hover': {
                              backgroundColor: 'rgba(12, 85, 184, 0.04)'
                            }
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.billCycleCode);
                          }}
                          sx={{
                            color: '#0C55B8',
                            '&:hover': {
                              backgroundColor: 'rgba(12, 85, 184, 0.04)'
                            }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
