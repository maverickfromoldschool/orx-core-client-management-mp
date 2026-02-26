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

import {EmptyState} from './empty-state';
import {type VariantData} from './variant-dialog.types';

export interface VariantsTableProps {
  data: VariantData[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onRowClick: (item: VariantData) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  onAddVariant?: () => void;
}

/** Table column definitions */
const columns = [
  {id: 'checkbox', label: '', width: 48},
  {id: 'actions', label: 'Actions', width: 100},
  {id: 'variantField', label: 'Variant Field', width: 200},
  {id: 'variantName', label: 'Variant Name', width: 200},
  {id: 'dataType', label: 'Data Type', width: 150},
  {id: 'systemDefined', label: 'System Defined', width: 150},
  {id: 'predefined', label: 'Predefined', width: 150},
  {id: 'relatedEntity', label: 'Related Entity', width: 180}
];

export function VariantsTable({
  data,
  selectedIds,
  onSelectionChange,
  onRowClick,
  onEdit,
  onDelete,
  isLoading = false,
  onAddVariant
}: VariantsTableProps) {
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedIds = data.map((item) => item.id);
      onSelectionChange(newSelectedIds);
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

  const handleRowClick = (item: VariantData) => (event: React.MouseEvent) => {
    event.preventDefault();
    onRowClick(item);
  };

  const isSelected = (id: string) => selectedIds.includes(id);
  const isAllSelected = Array.isArray(data) && data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && Array.isArray(data) && selectedIds.length < data.length;

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
                width: columns[1]?.width ?? 100
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
                  title="No variant fields found"
                  actionText="adding a new variant field"
                  onAction={onAddVariant}
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const isItemSelected = isSelected(item.id);
              const isSystemDefined = item.systemDefined;

              return (
                <TableRow
                  key={item.id}
                  hover
                  selected={isItemSelected}
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
                      checked={isItemSelected}
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
                          disabled={isSystemDefined}
                          sx={{
                            color: '#0C55B8 !important',
                            opacity: isSystemDefined ? 0.5 : 1,
                            cursor: isSystemDefined ? 'not-allowed' : 'pointer',
                            '&:hover': {
                              backgroundColor: isSystemDefined ? 'transparent' : 'rgba(12, 85, 184, 0.04)'
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

                  {/* Variant Field cell */}
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
                    {item.variantField}
                  </TableCell>

                  {/* Variant Name cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {item.variantName}
                  </TableCell>

                  {/* Data Type cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {item.dataType}
                  </TableCell>

                  {/* System Defined cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {item.systemDefined ? 'Yes' : 'No'}
                  </TableCell>

                  {/* Predefined cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {item.predefined ? 'Yes' : 'No'}
                  </TableCell>

                  {/* Related Entity cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD'
                    }}
                  >
                    {item.relatedEntity || '-'}
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
