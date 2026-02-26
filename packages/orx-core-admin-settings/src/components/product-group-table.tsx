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
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {EmptyState} from './empty-state';
import type {ProductGroupData} from './product-group-types';

/**
 * Dropdown option format
 */
interface DropdownOption {
  label: string;
  value: string;
}

/**
 * Props for the ProductGroupTable component
 */
export interface ProductGroupTableProps {
  /** Array of product group data to display */
  data: ProductGroupData[];
  /** Currently selected product group IDs */
  selectedIds: string[];
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
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when add product group is clicked from empty state */
  onAddProductGroup?: () => void;
  /** Product category options for display name mapping */
  productCategoryOptions?: DropdownOption[];
  /** External system options for display name mapping */
  externalSystemOptions?: DropdownOption[];
}

/** Table column definitions */
const columns = [
  {id: 'checkbox', label: '', width: 48},
  {id: 'actions', label: 'Actions', width: 120},
  {id: 'productGroup', label: 'Product Group', width: 150},
  {id: 'name', label: 'Name', width: 200},
  {id: 'productCategory', label: 'Product Category', width: 180},
  {id: 'externalSystem', label: 'External System', width: 150},
  {id: 'administrativeGroup', label: 'Administrative', width: 120},
  {id: 'retrievalSettings', label: 'Retrieval Settings', width: 140}
];

/**
 * ProductGroupTable component displays product group records in a data table
 */
export const ProductGroupTable: React.FC<ProductGroupTableProps> = ({
  data,
  selectedIds,
  onSelectionChange,
  onRowClick,
  onEdit,
  onDelete,
  onCopy,
  isLoading = false,
  onAddProductGroup,
  productCategoryOptions = [],
  externalSystemOptions = []
}) => {
  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  /**
   * Helper function to get display name from options array
   */
  const getDisplayName = (value: string | null | undefined, options: DropdownOption[]): string => {
    if (!value) return '-';
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      onSelectionChange(data.map((item) => item.productGroup));
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

  const handleRowClick = (item: ProductGroupData) => (event: React.MouseEvent) => {
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
                    width: column.width,
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
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
                  <TableCell key={column.id} sx={{borderBottom: '1px solid #CBCCCD'}}>
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
                width: columns[1]?.width ?? 120,
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
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
                  width: column.width,
                  fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + 2} sx={{borderBottom: 'none', padding: 0}}>
                <EmptyState
                  title="No product groups found"
                  actionText="adding your first product group"
                  onAction={onAddProductGroup}
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const isSelected = selectedIds.includes(item.productGroup);

              return (
                <TableRow
                  key={item.productGroup}
                  hover
                  onClick={handleRowClick(item)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#F5F5F5'
                    }
                  }}
                >
                  {/* Checkbox cell */}
                  <TableCell
                    padding="checkbox"
                    sx={{borderBottom: '1px solid #CBCCCD'}}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                    }}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => {
                        handleSelectOne(item.productGroup);
                      }}
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
                      <Tooltip title="Copy">
                        <IconButton
                          size="small"
                          disabled
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onCopy(item.productGroup);
                          }}
                          sx={{
                            color: '#0C55B8',
                            '&:hover': {
                              backgroundColor: 'rgba(12, 85, 184, 0.08)'
                            }
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onEdit(item.productGroup);
                          }}
                          sx={{
                            color: '#0C55B8',
                            '&:hover': {
                              backgroundColor: 'rgba(12, 85, 184, 0.08)'
                            }
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            onDelete(item.productGroup);
                          }}
                          sx={{
                            color: '#0C55B8',
                            '&:hover': {
                              backgroundColor: 'rgba(196, 30, 58, 0.08)'
                            }
                          }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>

                  {/* Product Group cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {item.productGroup}
                  </TableCell>

                  {/* Name cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {item.name}
                  </TableCell>

                  {/* Product Category cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {getDisplayName(item.productCategory, productCategoryOptions)}
                  </TableCell>

                  {/* External System cell */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#323334',
                      borderBottom: '1px solid #CBCCCD',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {getDisplayName(item.externalSystem, externalSystemOptions)}
                  </TableCell>

                  {/* Administrative cell */}
                  <TableCell
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      textAlign: 'center'
                    }}
                  >
                    <Checkbox
                      checked={item.administrativeGroup === 'Y'}
                      disabled
                      sx={{
                        color: '#002677',
                        '&.Mui-checked': {
                          color: '#002677'
                        },
                        opacity: 0.5
                      }}
                    />
                  </TableCell>

                  {/* Retrieval Settings cell */}
                  <TableCell
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      textAlign: 'center'
                    }}
                  >
                    <Checkbox
                      checked={
                        (item.productGroupAttributeList && item.productGroupAttributeList.length > 0) ||
                        (item.productGroupVariantList && item.productGroupVariantList.length > 0)
                      }
                      disabled
                      sx={{
                        color: '#002677',
                        '&.Mui-checked': {
                          color: '#002677'
                        },
                        opacity: 0.5
                      }}
                    />
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

export default ProductGroupTable;
