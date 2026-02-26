/* eslint-disable react/no-array-index-key */
import React from 'react';
import {Box, Button, IconButton} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import {PaginationProps} from '../types';

/**
 * Pagination component
 * Displays page numbers and navigation controls
 */
export const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, onPageChange}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small (0-based indexing)
      for (let i = 0; i < totalPages; i += 1) {
        pages.push(i);
      }
    } else {
      // Always show first 5 pages (0-based indexing)
      for (let i = 0; i < Math.min(maxVisiblePages, totalPages); i += 1) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (totalPages > maxVisiblePages + 1) {
        pages.push('...');
      }

      // Always show last page (0-based indexing)
      if (totalPages > maxVisiblePages) {
        pages.push(totalPages - 1);
      }
    }

    return pages;
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        padding: '20px 0 0',
        borderTop: '1px solid #CBCCCD'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <Box
                key={`ellipsis-${index}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '44px',
                  height: '44px',
                  padding: '10px 16px',
                  borderRadius: '8px'
                }}
              >
                <MoreHorizIcon sx={{color: '#323334'}} />
              </Box>
            );
          }

          const isActive = page === currentPage;

          return (
            <Button
              key={page}
              onClick={() => {
                handlePageClick(page);
              }}
              sx={{
                minWidth: '44px',
                width: '44px',
                height: '44px',
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: isActive ? '#002677' : 'transparent',
                color: isActive ? '#FFFFFF' : '#0C55B8',
                fontWeight: 700,
                fontSize: '14.22px',
                lineHeight: '18px',
                textAlign: 'center',
                '&:hover': {
                  backgroundColor: isActive ? '#002677' : '#F5F5F5'
                }
              }}
            >
              {typeof page === 'number' ? page + 1 : page}
            </Button>
          );
        })}

        {/* Next Button */}
        <IconButton
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
          sx={{
            width: '44px',
            height: '44px',
            color: '#0C55B8',
            '&:disabled': {
              color: '#CBCCCD'
            }
          }}
          aria-label="next page"
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
