import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import dayjs from 'dayjs';

import type {PriceListSummary} from '../services';

import EmptyState from './price-empty-state';
import LoadingSkeleton from './loading';

export interface PriceListTableProps {
  /** Array of price list data to display */
  data: PriceListSummary[];
  /** Callback when view action is clicked */
  onView: (priceListId: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
}

/**
 * PriceListTable component displays price lists in a table format
 */
export const PriceListTable: React.FC<PriceListTableProps> = ({data, onView, isLoading = false}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('MMM D, YYYY');
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: '#FFF',
              '& th': {
                borderBottom: '1px solid #CBCCCD'
              }
            }}
          >
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                color: '#323334',
                fontSize: '14px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              Actions
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: '#323334',
                fontSize: '14px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              Price List Code
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: '#323334',
                fontSize: '14px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              Price List Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: '#323334',
                fontSize: '14px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              Business Sector
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: '#323334',
                fontSize: '14px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              Price List Type
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                color: '#323334',
                fontSize: '14px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              Price List Entries
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: '#323334',
                fontSize: '14px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              Effective Date
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 700,
                color: '#323334',
                fontSize: '14px',
                fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
              }}
            >
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && <LoadingSkeleton />}
          {!isLoading && (!Array.isArray(data) || data.length === 0) && <EmptyState />}
          {!isLoading &&
            Array.isArray(data) &&
            data.length > 0 &&
            data.map((priceList) => (
              <TableRow
                key={priceList.id}
                sx={{
                  '&:hover': {
                    backgroundColor: '#F5F5F5',
                    cursor: 'pointer'
                  },
                  '& td': {
                    borderBottom: '1px solid #CBCCCD'
                  }
                }}
              >
                <TableCell align="center">
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      onClick={() => {
                        onView(priceList.id);
                      }}
                      sx={{
                        color: '#0C55B8',
                        '&:hover': {
                          backgroundColor: 'rgba(12, 85, 184, 0.08)'
                        }
                      }}
                    >
                      <VisibilityOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '14px',
                    color: '#4B4D4F',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                  }}
                >
                  {priceList.priceListCode}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '14px',
                    color: '#4B4D4F',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                  }}
                >
                  {priceList.priceListName}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '14px',
                    color: '#4B4D4F',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                  }}
                >
                  {priceList.businessSector}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '14px',
                    color: '#4B4D4F',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                  }}
                >
                  {priceList.priceListType}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontSize: '14px',
                    color: '#4B4D4F',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                  }}
                >
                  {priceList.priceListEntries}
                </TableCell>
                <TableCell
                  sx={{
                    fontSize: '14px',
                    color: '#4B4D4F',
                    fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                  }}
                >
                  {formatDate(priceList.effectiveDate)}
                </TableCell>
                <TableCell>
                  <Chip
                    label={priceList.status}
                    size="small"
                    sx={{
                      backgroundColor: '#E8F5E9',
                      color: '#2E7D32',
                      fontWeight: 600,
                      fontSize: '12px',
                      height: '24px',
                      fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PriceListTable;
