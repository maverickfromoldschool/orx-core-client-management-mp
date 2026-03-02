import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import type {AssignmentLevel, UnassignedCAG} from './assign-cags';
import {ClientPagination} from './client-pagination';

export interface CagsTableProps {
  totalElements: number;
  unassignedCAGs: UnassignedCAG[];
  assignAction: string;
  handleApply: () => void;
  handleAssignActionChange: (event: any) => void;
  loading: boolean;
  assignmentLevel: AssignmentLevel;
  selectedCAGIds: string[];
  handleSelectAllCAGs: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectCAG: (id: string) => void;
  getColumnSpan: () => number;
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}

export const CagsTable: React.FC<CagsTableProps> = ({
  totalElements,
  unassignedCAGs,
  assignAction,
  handleApply,
  handleAssignActionChange,
  loading,
  assignmentLevel,
  selectedCAGIds,
  handleSelectAllCAGs,
  handleSelectCAG,
  getColumnSpan,
  totalPages,
  currentPage,
  handlePageChange
}) => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          mt: 3
        }}
      >
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#4B4D4F',
            fontFamily: '"Enterprise Sans VF", sans-serif'
          }}
        >
          Number of unassigned CAGs: {totalElements || unassignedCAGs.length}
        </Typography>

        {/* Right side - Apply and Assign dropdown */}
        <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          {/* Apply link */}
          <Typography
            component="span"
            onClick={selectedCAGIds.length > 0 ? handleApply : undefined}
            sx={{
              fontSize: '14px',
              fontWeight: 700,
              color: selectedCAGIds.length > 0 ? '#0C55B8' : '#CBCCCD',
              textDecoration: selectedCAGIds.length > 0 ? 'underline' : 'none',
              cursor: selectedCAGIds.length > 0 ? 'pointer' : 'not-allowed',
              fontFamily: '"Enterprise Sans VF", sans-serif',
              '&:hover': {
                textDecoration: selectedCAGIds.length > 0 ? 'underline' : 'none'
              }
            }}
          >
            Apply
          </Typography>

          {/* Assign dropdown */}
          <FormControl size="small" sx={{minWidth: 140}}>
            <Select
              value={assignAction}
              onChange={handleAssignActionChange}
              displayEmpty
              disabled={selectedCAGIds.length === 0}
              IconComponent={KeyboardArrowDownIcon}
              sx={{
                fontSize: '14px',
                color: '#4B4D4F',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                fontFamily: '"Enterprise Sans VF", sans-serif',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#CBCCCD'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#002677'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#002677'
                },
                '& .MuiSelect-select': {
                  padding: '8px 12px'
                }
              }}
              renderValue={(value) => {
                if (!value) {
                  return 'Assign';
                }
                return value.charAt(0).toUpperCase() + value.slice(1);
              }}
            >
              <MenuItem value="assign">Assign</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table with unassigned CAGs */}
      <TableContainer sx={{px: 3}}>
        <Table
          sx={{
            '& .MuiTableBody-root .MuiTableCell-root': {
              borderBottom: 'none'
            },
            '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
              borderBottom: '1px solid #E5E5E6'
            },
            '& .MuiTableBody-root .MuiTableRow-root:nth-of-type(even)': {
              backgroundColor: '#FAFAFA'
            }
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{borderBottom: '2px solid #E5E5E6'}}>
                <Checkbox
                  checked={selectedCAGIds.length === unassignedCAGs.length && unassignedCAGs.length > 0}
                  indeterminate={selectedCAGIds.length > 0 && selectedCAGIds.length < unassignedCAGs.length}
                  onChange={handleSelectAllCAGs}
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
              {/* Carrier column - always shown */}
              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: '14px',
                  color: '#000000',
                  fontFamily: '"Enterprise Sans VF", sans-serif',
                  borderBottom: '2px solid #E5E5E6'
                }}
              >
                Carrier Name & ID
              </TableCell>
              {/* Account column - shown for account and group levels */}
              {(assignmentLevel === 'account' || assignmentLevel === 'group') && (
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#000000',
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    borderBottom: '2px solid #E5E5E6'
                  }}
                >
                  Account Name & ID
                </TableCell>
              )}
              {/* Group column - shown only for group level */}
              {assignmentLevel === 'group' && (
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#000000',
                    fontFamily: '"Enterprise Sans VF", sans-serif',
                    borderBottom: '2px solid #E5E5E6'
                  }}
                >
                  Group Name & ID
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={getColumnSpan()} sx={{textAlign: 'center', py: 4}}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#4B4D4F',
                      fontFamily: '"Enterprise Sans VF", sans-serif'
                    }}
                  >
                    Loading...
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading && unassignedCAGs.length === 0 && (
              <TableRow>
                <TableCell colSpan={getColumnSpan()} sx={{textAlign: 'center', py: 4}}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#4B4D4F',
                      fontFamily: '"Enterprise Sans VF", sans-serif'
                    }}
                  >
                    No unassigned CAGs found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {!loading &&
              unassignedCAGs.length > 0 &&
              unassignedCAGs.map((cag) => (
                <TableRow key={cag.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCAGIds.includes(cag.id)}
                      onChange={() => {
                        handleSelectCAG(cag.id);
                      }}
                      sx={{
                        color: '#002677',
                        '&.Mui-checked': {
                          color: '#002677'
                        }
                      }}
                    />
                  </TableCell>
                  {/* Carrier column - always shown */}
                  <TableCell
                    sx={{
                      fontSize: '14px',
                      color: '#4B4D4F',
                      fontFamily: '"Enterprise Sans VF", sans-serif'
                    }}
                  >
                    <div>{cag.carrierName}</div>
                    <div style={{color: '#767676', fontSize: '12px'}}>{cag.carrierId}</div>
                  </TableCell>
                  {/* Account column - shown for account and group levels */}
                  {(assignmentLevel === 'account' || assignmentLevel === 'group') && (
                    <TableCell
                      sx={{
                        fontSize: '14px',
                        color: '#4B4D4F',
                        fontFamily: '"Enterprise Sans VF", sans-serif'
                      }}
                    >
                      <div>{cag.accountName}</div>
                      <div style={{color: '#767676', fontSize: '12px'}}>{cag.accountId}</div>
                    </TableCell>
                  )}
                  {/* Group column - shown only for group level */}
                  {assignmentLevel === 'group' && (
                    <TableCell
                      sx={{
                        fontSize: '14px',
                        color: '#4B4D4F',
                        fontFamily: '"Enterprise Sans VF", sans-serif'
                      }}
                    >
                      <div>{cag.groupName}</div>
                      <div style={{color: '#767676', fontSize: '12px'}}>{cag.groupId}</div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <ClientPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        )}
      </TableContainer>
    </>
  );
};
