import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Box,
  Skeleton,
  Tooltip
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PersonIcon from '@mui/icons-material/Person';
import ComputerIcon from '@mui/icons-material/Computer';

import type {LookupFieldValue} from '../services/lookup-api.types';

import {EmptyState} from './empty-state';

/**
 * Lookup data type
 */
export interface LookupData {
  id: string;
  lookupField: string;
  displayName: string;
  managedBy: string;
  numericValue: string;
  maxStoredValueLength?: string;
  values?: LookupFieldValue[];
}

/**
 * Props for the LookupTable component
 */
export interface LookupTableProps {
  /** Array of lookup data to display */
  data: LookupData[];
  /** Currently selected lookup IDs */
  selectedIds: string[];
  /** Callback when selection changes */
  onSelectionChange: (selectedIds: string[]) => void;
  /** Callback when row is clicked */
  onRowClick: (item: LookupData) => void;
  /** Callback when edit action is clicked */
  onEdit: (itemId: string) => void;
  /** Callback when delete action is clicked */
  onDelete: (itemId: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when add lookup is clicked from empty state */
  onAddLookup?: () => void;
}

/** Table column definitions */
const columns = [
  {id: 'checkbox', label: '', width: 48},
  {id: 'actions', label: 'Actions', width: 100},
  {
    id: 'lookupField',
    label: 'Lookup field (identifier)',
    width: 250,
    tooltip: 'This is a system identifier which is hidden from end users and cannot be altered once created.'
  },
  {id: 'displayName', label: 'Display Name', width: 250},
  {
    id: 'managedBy',
    label: 'Managed By',
    width: 180,
    tooltip:
      "System-managed fields can't be deleted with limited editing capabilities, while user-managed fields are more flexible."
  },
  {id: 'numericValue', label: 'Numeric Value', width: 140}
];

/**
 * LookupTable component displays lookup records in a data table
 */
export const LookupTable: React.FC<LookupTableProps> = ({
  data,
  selectedIds,
  onSelectionChange,
  onRowClick,
  onEdit,
  onDelete,
  isLoading = false,
  onAddLookup
}) => {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onSelectionChange(data.map((item) => item.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (itemId: string) => {
    if (selectedIds.includes(itemId)) {
      onSelectionChange(selectedIds.filter((id) => id !== itemId));
    } else {
      onSelectionChange([...selectedIds, itemId]);
    }
  };

  const handleRowClick = (item: LookupData) => (event: React.MouseEvent) => {
    event.preventDefault();
    onRowClick(item);
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
            {/* Checkbox column header */}
            <TableCell
              padding="checkbox"
              sx={{
                width: columns[0]?.width ?? 48,
                borderBottom: '1px solid #CBCCCD'
              }}
            >
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleSelectAll}
                sx={{
                  color: '#002677',
                  '&.Mui-checked': {
                    color: '#002677'
                  },
                  '&.MuiCheckbox-indeterminate': {
                    color: '#002677'
                  }
                }}
              />
            </TableCell>

            {/* Actions column header */}
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: '14px',
                color: '#323334',
                borderBottom: '1px solid #CBCCCD',
                width: columns[1]?.width ?? 80
              }}
            >
              {columns[1]?.label}
            </TableCell>

            {/* Other column headers */}
            {columns.slice(2).map((column) => (
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
                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                  {column.label}
                  {(column.id === 'lookupField' || column.id === 'managedBy') && (
                    <Tooltip title={`${column.tooltip}`} arrow>
                      <HelpOutlineIcon sx={{fontSize: '16px', color: '#0066F5', cursor: 'pointer'}} />
                    </Tooltip>
                  )}
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} sx={{borderBottom: 'none', padding: 0}}>
                <EmptyState
                  title="No lookup fields found"
                  actionText="adding a new lookup field"
                  onAction={onAddLookup}
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <TableRow
                  key={item.id}
                  hover
                  selected={isSelected}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#F5F5F5'
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#E3F2FD',
                      '&:hover': {
                        backgroundColor: '#BBDEFB'
                      }
                    }
                  }}
                >
                  {/* Checkbox cell */}
                  <TableCell
                    padding="checkbox"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectOne(item.id);
                    }}
                    sx={{borderBottom: '1px solid #CBCCCD'}}
                  >
                    <Checkbox
                      checked={isSelected}
                      sx={{
                        color: '#002677',
                        '&.Mui-checked': {
                          color: '#002677'
                        }
                      }}
                    />
                  </TableCell>

                  {/* Actions cell */}
                  <TableCell sx={{borderBottom: '1px solid #CBCCCD'}}>
                    <Box sx={{display: 'flex', gap: 0.5}}>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          disabled={item.managedBy === 'System'}
                          sx={{
                            color: '#0C55B8 !important',
                            opacity: item.managedBy === 'System' ? 0.5 : 1,
                            cursor: item.managedBy === 'System' ? 'not-allowed' : 'pointer',
                            '&:hover': {
                              backgroundColor: item.managedBy === 'System' ? 'transparent' : 'rgba(12, 85, 184, 0.04)'
                            }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item.id);
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
                    </Box>
                  </TableCell>

                  {/* Lookup Field cell */}
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
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      {item.lookupField}
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: '24px',
                          height: '24px',
                          padding: '0 6px',
                          borderRadius: '4px',
                          backgroundColor: '#FCF0F0',
                          color: '#323334',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        {item.values?.length || 0}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Display Name cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {item.displayName}
                  </TableCell>

                  {/* Managed By cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: item.managedBy === 'User' ? '#EEF4FF' : '#FEF9EA',
                        color: item.managedBy === 'User' ? '#002677' : '#826100',
                        fontSize: '12px',
                        fontWeight: 600,
                        lineHeight: 1
                      }}
                    >
                      {item.managedBy === 'User' ? (
                        <PersonIcon sx={{fontSize: '16px', color: '#002677', display: 'flex'}} />
                      ) : (
                        <ComputerIcon sx={{fontSize: '16px', color: '#826100', display: 'flex'}} />
                      )}
                      <Box component="span" sx={{lineHeight: '16px'}}>
                        {item.managedBy}
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Numeric Value cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {item.numericValue}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LookupTable;
