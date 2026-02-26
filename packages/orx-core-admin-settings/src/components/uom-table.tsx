import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Skeleton,
  Tooltip
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {EmptyState} from './empty-state';

/**
 * Unit of Measure data type
 */
export interface UnitOfMeasureData {
  uom: string;
  description: string;
  decimals: number;
  unitTypeCd: string;
  appendToQuantity: string; // 'Y' or 'N'
}

/**
 * Props for the UomTable component
 */
export interface UomTableProps {
  /** Array of UOM data to display */
  data: UnitOfMeasureData[];
  /** Callback when row is clicked */
  onRowClick: (item: UnitOfMeasureData) => void;
  /** Callback when edit action is clicked */
  onEdit: (itemId: string) => void;
  /** Callback when delete action is clicked */
  onDelete: (itemId: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
}

/**
 * UomTable component displays the unit of measure table with actions
 */
export const UomTable: React.FC<UomTableProps> = ({data, onRowClick, onEdit, onDelete, isLoading = false}) => {
  // Show loading skeleton
  if (isLoading) {
    return (
      <TableContainer>
        <Table sx={{'& .MuiTableCell-root': {borderBottom: '1px solid #E0E0E0'}}}>
          <TableHead>
            <TableRow sx={{backgroundColor: '#F5F5F5'}}>
              <TableCell>
                <Skeleton variant="text" width="80%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="80%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="60%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="70%" />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width="50%" />
              </TableCell>
              <TableCell sx={{width: '120px'}}>
                <Skeleton variant="text" width="60%" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[1, 2, 3].map((index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton variant="text" width="90%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="85%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="40%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="75%" />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="30%" />
                </TableCell>
                <TableCell>
                  <Box sx={{display: 'flex', gap: 1}}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="circular" width={24} height={24} />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table
        sx={{
          '& .MuiTableCell-root': {
            borderBottom: '1px solid #E0E0E0',
            fontFamily: '"Enterprise Sans VF", sans-serif'
          }
        }}
      >
        <TableHead>
          <TableRow sx={{backgroundColor: '#F5F5F5'}}>
            <TableCell
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#002677'
              }}
            >
              Unit of Measure
            </TableCell>
            <TableCell
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#002677'
              }}
            >
              Description
            </TableCell>
            <TableCell
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#002677',
                width: '120px'
              }}
            >
              Decimals
            </TableCell>
            <TableCell
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#002677'
              }}
            >
              Unit Type
            </TableCell>
            <TableCell
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#002677',
                width: '140px'
              }}
            >
              Append to Count
            </TableCell>
            <TableCell
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#002677',
                width: '120px'
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} sx={{borderBottom: 'none', padding: 0}}>
                <EmptyState
                  title="No units of measure found"
                  description="Try adjusting your filters or add a new unit of measure using the button above"
                  iconSize="small"
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => {
              return (
                <TableRow
                  key={row.uom}
                  hover
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {backgroundColor: '#F9F9F9'}
                  }}
                >
                  <TableCell
                    onClick={() => {
                      onRowClick(row);
                    }}
                    sx={{
                      fontSize: '14px',
                      color: '#424242',
                      fontWeight: 600
                    }}
                  >
                    {row.uom}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      onRowClick(row);
                    }}
                    sx={{
                      fontSize: '14px',
                      color: '#424242'
                    }}
                  >
                    {row.description}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      onRowClick(row);
                    }}
                    sx={{
                      fontSize: '14px',
                      color: '#424242'
                    }}
                  >
                    {row.decimals}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      onRowClick(row);
                    }}
                    sx={{
                      fontSize: '14px',
                      color: '#424242'
                    }}
                  >
                    {row.unitTypeCd}
                  </TableCell>
                  <TableCell
                    onClick={() => {
                      onRowClick(row);
                    }}
                    sx={{
                      fontSize: '14px',
                      color: '#424242'
                    }}
                  >
                    {row.appendToQuantity === 'Y' ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row.uom);
                          }}
                          sx={{
                            color: '#002677',
                            '&:hover': {backgroundColor: 'rgba(0, 38, 119, 0.04)'}
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
                            onDelete(row.uom);
                          }}
                          sx={{
                            color: '#D32F2F',
                            '&:hover': {backgroundColor: 'rgba(211, 47, 47, 0.04)'}
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
};

export default UomTable;
