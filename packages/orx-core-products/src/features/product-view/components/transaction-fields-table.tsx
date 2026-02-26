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
  Tooltip,
  Typography
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import {type TransactionFieldData} from './transaction-field-dialog.types';

export interface TransactionFieldsTableProps {
  data: TransactionFieldData[];
  onRowClick: (item: TransactionFieldData) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

/** Table column definitions */
const columns = [
  {id: 'actions', label: 'Actions', width: 100},
  {id: 'transactionAttribute', label: 'Transaction Attribute', width: 200},
  {id: 'label', label: 'Label', width: 180},
  {id: 'dataType', label: 'Data Type', width: 150},
  {id: 'unitOfMeasure', label: 'Unit of Measure', width: 150},
  {id: 'displaySequence', label: 'Display Sequence', width: 150},
  {id: 'required', label: 'Required', width: 120},
  {id: 'negativeAllowed', label: 'Negative Allowed', width: 150},
  {id: 'summarization', label: 'Summarization', width: 150},
  {id: 'accountUsage', label: 'Account Usage', width: 150}
];

export function TransactionFieldsTable({
  data,
  onRowClick,
  onEdit,
  onDelete,
  isLoading = false
}: TransactionFieldsTableProps) {
  const handleRowClick = (item: TransactionFieldData) => (event: React.MouseEvent) => {
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
            {Array.from({length: 5}, (_, i) => `skeleton-${i}`).map((skeletonId) => (
              <TableRow key={skeletonId}>
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

  // Empty state
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{p: 4, textAlign: 'center'}}>
        <Typography sx={{fontSize: '14px', color: '#4B4D4F'}}>No transaction fields found.</Typography>
      </Box>
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
                  width: column.width,
                  padding: '12px 16px'
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow
              key={item.transactionAttribute}
              hover
              onClick={handleRowClick(item)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#F7F7F7'
                }
              }}
            >
              <TableCell sx={{padding: '12px 16px'}}>
                <Box sx={{display: 'flex', gap: '8px'}}>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.transactionAttribute);
                      }}
                      sx={{
                        color: '#0C55B8 !important',
                        '&:hover': {
                          backgroundColor: 'rgba(12, 85, 184, 0.04)'
                        }
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(item.transactionAttribute);
                      }}
                      sx={{
                        color: '#0C55B8',
                        '&:hover': {
                          backgroundColor: '#E8F0FE'
                        }
                      }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>
                {item.transactionAttribute}
              </TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>{item.label}</TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>{item.dataType}</TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>
                {item.unitOfMeasure}
              </TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>
                {item.displaySequence}
              </TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>
                <Checkbox
                  checked={item.required}
                  disabled
                  sx={{
                    color: '#CBCCCD',
                    '&.Mui-checked': {
                      color: '#0C55B8'
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>
                <Checkbox
                  checked={item.negativeAllowed}
                  disabled
                  sx={{
                    color: '#CBCCCD',
                    '&.Mui-checked': {
                      color: '#0C55B8'
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>
                <Checkbox
                  checked={item.summarization}
                  disabled
                  sx={{
                    color: '#CBCCCD',
                    '&.Mui-checked': {
                      color: '#0C55B8'
                    }
                  }}
                />
              </TableCell>
              <TableCell sx={{fontSize: '14px', color: '#323334', padding: '12px 16px'}}>
                <Checkbox
                  checked={item.accountUsage}
                  disabled
                  sx={{
                    color: '#CBCCCD',
                    '&.Mui-checked': {
                      color: '#0C55B8'
                    }
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
