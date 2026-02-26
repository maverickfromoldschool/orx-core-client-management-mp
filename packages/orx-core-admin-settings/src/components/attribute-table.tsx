import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Skeleton,
  Tooltip
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import {EmptyState} from './empty-state';
import type {AttributeData} from './attribute-types';
import {AttributeHelpers} from './attribute-types';

/**
 * Props for the AttributeTable component
 */
export interface AttributeTableProps {
  /** Array of attribute data to display */
  data: AttributeData[];
  /** Currently selected attribute IDs */
  selectedIds: string[];
  // /** Callback when selection changes */
  // onSelectionChange: (selectedIds: string[]) => void; // TODO: Implement selection functionality
  /** Callback when row is clicked */
  onRowClick: (item: AttributeData) => void;
  /** Callback when edit action is clicked */
  onEdit: (itemId: string) => void;
  /** Callback when delete action is clicked */
  onDelete: (itemId: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback when add attribute is clicked from empty state */
  onAddAttribute?: () => void;
}

/** Table column definitions */
const columns = [
  {id: 'actions', label: 'Actions', width: 100},
  {id: 'attributeField', label: 'Attribute', width: 180},
  {id: 'description', label: 'Description', width: 250},
  {id: 'entities', label: 'Entity(s)', width: 200},
  {id: 'dataType', label: 'Data Type', width: 150},
  {
    id: 'systemDefined',
    label: 'System Defined',
    width: 140,
    tooltip: 'System-defined attributes have limited editing capabilities'
  },
  {id: 'predefined', label: 'Predefined', width: 120},
  {id: 'required', label: 'Required', width: 100}
];

/**
 * AttributeTable component displays attribute records in a data table
 */
export const AttributeTable: React.FC<AttributeTableProps> = ({
  data,
  selectedIds,
  // onSelectionChange, // TODO: Implement selection functionality
  onRowClick,
  onEdit,
  onDelete,
  isLoading = false,
  onAddAttribute
}) => {
  const handleRowClick = (item: AttributeData) => (event: React.MouseEvent) => {
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
            {/* Actions column header */}
            <TableCell
              sx={{
                fontWeight: 700,
                fontSize: '14px',
                color: '#323334',
                borderBottom: '1px solid #CBCCCD',
                width: columns[0]?.width ?? 80,
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              {columns[0]?.label}
            </TableCell>

            {/* Other column headers */}
            {columns.slice(1).map((column) => (
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
                <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                  {column.label}
                  {column.tooltip && (
                    <Tooltip title={column.tooltip} arrow placement="top">
                      <HelpOutlineIcon sx={{fontSize: 16, color: '#6F7172'}} />
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
                  title="No attributes found"
                  actionText="adding your first attribute"
                  onAction={onAddAttribute}
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => {
              const isSelected = selectedIds.includes(item.attribute);

              return (
                <TableRow
                  key={item.attribute}
                  hover
                  selected={isSelected}
                  sx={{
                    cursor: 'pointer',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(0, 38, 119, 0.04)'
                    },
                    '&.Mui-selected:hover': {
                      backgroundColor: 'rgba(0, 38, 119, 0.08)'
                    }
                  }}
                >
                  {/* Actions */}
                  <TableCell sx={{borderBottom: '1px solid #CBCCCD'}}>
                    <Box sx={{display: 'flex', gap: 0.5}}>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item.attribute);
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
                      {!AttributeHelpers.toBoolean(item.systemDefinedLookup) && (
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item.attribute);
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
                      )}
                    </Box>
                  </TableCell>

                  {/* Attribute Field */}
                  <TableCell
                    onClick={handleRowClick(item)}
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      fontSize: '14px',
                      color: '#323334',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {item.attribute}
                  </TableCell>

                  {/* Description */}
                  <TableCell
                    onClick={handleRowClick(item)}
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      fontSize: '14px',
                      color: '#323334',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {item.description}
                  </TableCell>

                  {/* Entities */}
                  <TableCell
                    onClick={handleRowClick(item)}
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      fontSize: '14px',
                      color: '#323334',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {AttributeHelpers.getEntitiesDisplay(item.attributeEntity)}
                  </TableCell>

                  {/* Data Type */}
                  <TableCell
                    onClick={handleRowClick(item)}
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      fontSize: '14px',
                      color: '#323334',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  >
                    {item.dataType}
                  </TableCell>

                  {/* System Defined */}
                  <TableCell
                    onClick={handleRowClick(item)}
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      textAlign: 'center'
                    }}
                  >
                    <Checkbox
                      checked={AttributeHelpers.toBoolean(item.systemDefinedLookup)}
                      disabled
                      sx={{
                        color: '#002677',
                        opacity: 0.5,
                        '&.Mui-checked': {
                          color: '#002677'
                        },
                        '&.Mui-disabled': {
                          color: AttributeHelpers.toBoolean(item.systemDefinedLookup) ? '#002677' : '#CBCCCD',
                          opacity: 0.5
                        }
                      }}
                    />
                  </TableCell>

                  {/* Predefined */}
                  <TableCell
                    onClick={handleRowClick(item)}
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      textAlign: 'center'
                    }}
                  >
                    <Checkbox
                      checked={AttributeHelpers.toBoolean(item.predefinedSw)}
                      disabled
                      sx={{
                        color: '#002677',
                        opacity: 0.5,
                        '&.Mui-checked': {
                          color: '#002677'
                        },
                        '&.Mui-disabled': {
                          color: AttributeHelpers.toBoolean(item.predefinedSw) ? '#002677' : '#CBCCCD',
                          opacity: 0.5
                        }
                      }}
                    />
                  </TableCell>

                  {/* Required */}
                  <TableCell
                    onClick={handleRowClick(item)}
                    sx={{
                      borderBottom: '1px solid #CBCCCD',
                      textAlign: 'center'
                    }}
                  >
                    <Checkbox
                      checked={AttributeHelpers.toBoolean(item.required)}
                      disabled
                      sx={{
                        color: '#002677',
                        opacity: 0.5,
                        '&.Mui-checked': {
                          color: '#002677'
                        },
                        '&.Mui-disabled': {
                          color: AttributeHelpers.toBoolean(item.required) ? '#002677' : '#CBCCCD',
                          opacity: 0.5
                        }
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

export default AttributeTable;
