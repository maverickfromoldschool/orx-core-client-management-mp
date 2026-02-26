/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import {
  Box,
  Card,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterIcon from '@mui/icons-material/FilterList';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import {EmptyState} from '../../empty-state';
import {Pagination} from '../../pagination';

import {AccountingCodeListProps} from './AccountingCodeList.types';

export const AccountingCodeList: React.FC<AccountingCodeListProps> = ({
  data = [],
  loading = false,
  totalCount = 0,
  onCreateNew,
  onEdit,
  onDelete,
  onFilter,
  onPageChange,
  page = 0,
  pageSize = 10,
  glAccountTypes = [],
  glAccountGroups = []
}) => {
  const handleFilterClick = () => {
    onFilter?.();
  };

  // Convert 0-indexed page to 1-indexed for display
  const currentPage = page + 1;
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    // Convert 1-indexed page back to 0-indexed for API
    onPageChange?.(newPage - 1);
  };

  const columns = [
    {id: 'actions', label: 'Actions', width: 100},
    {id: 'accountingCode', label: 'Accounting Code', width: 150},
    {id: 'description', label: 'Description', width: 250},
    {id: 'glAccountType', label: 'GL Account Type', width: 180},
    {id: 'glAccountName', label: 'GL Account Name', width: 250},
    {id: 'glAccountNumber', label: 'GL Account Number', width: 180},
    {id: 'glAccountGroup', label: 'GL Account Group', width: 220}
  ];

  return (
    <Box sx={{p: 3}}>
      {/* Main Card */}
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
            Accounting Code
          </Typography>
        </Box>

        {/* Action Bar with Item Count and Buttons */}
        <Box sx={{px: 3, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography
            sx={{
              fontSize: '14px',
              color: '#323334',
              fontWeight: 400
            }}
          >
            Number of items: {totalCount}
          </Typography>
          <Box sx={{display: 'flex', gap: 1.5, alignItems: 'center'}}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateNew}
              sx={{
                textTransform: 'none',
                bgcolor: '#003087',
                color: 'white',
                px: 3,
                borderRadius: '24px',
                '&:hover': {
                  bgcolor: '#002060'
                }
              }}
            >
              Add New
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleFilterClick}
              sx={{
                textTransform: 'none',
                borderColor: 'divider',
                color: 'text.primary',
                borderRadius: '24px'
              }}
            >
              Filters
            </Button>
          </Box>
        </Box>

        {/* Data Table */}
        <Box sx={{px: 3}}>
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
                {loading ? (
                  Array.from({length: 5}, (_, index) => index).map((rowIndex) => (
                    <TableRow key={`skeleton-row-${rowIndex}`}>
                      {columns.map((column) => (
                        <TableCell key={column.id} sx={{borderBottom: '1px solid #CBCCCD'}}>
                          <Skeleton variant="text" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} sx={{borderBottom: 'none', padding: 0}}>
                      <EmptyState
                        title="No accounting codes found"
                        actionText="adding your first accounting code"
                        onAction={onCreateNew}
                      />
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item) => {
                    const typeCode = item.glAccountType;
                    const typeOption = glAccountTypes?.find((type) => type.value === typeCode);
                    const groupCode = item.glAccountGroup;
                    const groupOption = glAccountGroups?.find((group) => group.value === groupCode);

                    return (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: '#F5F5F5'
                          }
                        }}
                      >
                        {/* Actions cell */}
                        <TableCell sx={{borderBottom: '1px solid #CBCCCD'}}>
                          <Box sx={{display: 'flex', gap: 0.5}}>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete?.(item);
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
                            <Tooltip title="Edit" arrow>
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEdit?.(item);
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

                        {/* Accounting Code cell */}
                        <TableCell
                          sx={{
                            fontSize: '14px',
                            color: '#4B4D4F',
                            borderBottom: '1px solid #CBCCCD',
                            fontWeight: 400
                          }}
                        >
                          {item.accountingCode}
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

                        {/* GL Account Type cell */}
                        <TableCell
                          sx={{
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD'
                          }}
                        >
                          {typeOption ? `${typeOption.label} (${typeCode})` : typeCode}
                        </TableCell>

                        {/* GL Account Name cell */}
                        <TableCell
                          sx={{
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD'
                          }}
                        >
                          {item.glAccountName}
                        </TableCell>

                        {/* GL Account Number cell */}
                        <TableCell
                          sx={{
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD'
                          }}
                        >
                          {item.glAccountNumber}
                        </TableCell>

                        {/* GL Account Group cell */}
                        <TableCell
                          sx={{
                            fontSize: '14px',
                            color: '#323334',
                            borderBottom: '1px solid #CBCCCD'
                          }}
                        >
                          {groupOption ? `${groupOption.label} (${groupCode})` : groupCode}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <Box sx={{px: 3, pb: 2}}>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default AccountingCodeList;