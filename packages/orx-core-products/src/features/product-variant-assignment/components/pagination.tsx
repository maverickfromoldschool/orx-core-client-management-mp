import React from 'react';
import {Box, Button, IconButton} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import {PaginationProps} from '../types';

/**
 * Pagination component for Product Variant Assignment
 * Displays page numbers and navigation controls
 *
 * Features:
 * - Current page highlighting
 * - Page number display with ellipsis for many pages
 * - Previous/next buttons with disabled states
 * - Loading state support
 * - Follows Figma design specifications
 *
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 12.5
 */
export const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, onPageChange, loading = false}) => {
  /**
   * Generate page numbers to display with ellipsis logic
   * Shows first 5 pages, ellipsis, and last page when total pages > 7
   */
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else {
      // Always show first 5 pages
      for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i += 1) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (totalPages > maxVisiblePages + 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > maxVisiblePages) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  /**
   * Handle page number click
   * Ignores clicks on ellipsis and current page
   */
  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page);
    }
  };

  /**
   * Handle next button click
   * Disabled when on last page
   */
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        padding: '20px 0 0',
        borderTop: '1px solid #CBCCCD',
        opacity: loading ? 0.6 : 1,
        pointerEvents: loading ? 'none' : 'auto'
      }}
      role="navigation"
      aria-label="Pagination navigation"
      aria-busy={loading}
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
            // Create unique key based on position (before which page number)
            const nextPage = pageNumbers[index + 1];
            return (
              <Box
                key={`ellipsis-${nextPage}`}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '44px',
                  height: '44px',
                  padding: '10px 16px',
                  borderRadius: '8px'
                }}
                aria-label="More pages"
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
              disabled={loading}
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
                },
                '&:disabled': {
                  opacity: 0.6
                }
              }}
              aria-label={`${isActive ? 'Current page, ' : ''}Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </Button>
          );
        })}

        {/* Next Button */}
        <IconButton
          onClick={handleNext}
          disabled={currentPage >= totalPages || loading}
          sx={{
            width: '44px',
            height: '44px',
            color: '#0C55B8',
            '&:disabled': {
              color: '#CBCCCD'
            }
          }}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
