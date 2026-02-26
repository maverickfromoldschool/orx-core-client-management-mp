import React from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
}

/**
 * Generates the array of page numbers to display with ellipsis logic.
 * Shows: 1, 2, 3, 4, 5, ..., lastPage when totalPages > 7
 */
const getPageNumbers = (currentPage: number, totalPages: number): (number | 'ellipsis')[] => {
  if (totalPages <= 7) {
    return Array.from({length: totalPages}, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];

  // Always show first 5 pages when near the start
  if (currentPage <= 4) {
    pages.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
  }
  // Show last pages when near the end
  else if (currentPage >= totalPages - 3) {
    pages.push(1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  }
  // Show pages around current page
  else {
    pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
  }

  return pages;
};

export const Pagination: React.FC<PaginationProps> = ({currentPage, totalPages, onPageChange}) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 0.5,
        py: 2,
        px: 2
      }}
    >
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          // Create unique key based on position (before which page number)
          const nextPage = pageNumbers[index + 1];
          return (
            <Typography
              key={`ellipsis-before-${nextPage}`}
              sx={{
                px: 1,
                color: '#0C55B8',
                fontSize: '14px',
                userSelect: 'none'
              }}
            >
              ...
            </Typography>
          );
        }

        const isActive = page === currentPage;

        return (
          <Box
            key={page}
            onClick={() => {
              handlePageClick(page);
            }}
            role="button"
            tabIndex={0}
            aria-label={`Page ${page}`}
            aria-current={isActive ? 'page' : undefined}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handlePageClick(page);
              }
            }}
            sx={{
              minWidth: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              cursor: isActive ? 'default' : 'pointer',
              backgroundColor: isActive ? '#002677' : 'transparent',
              color: isActive ? '#FFFFFF' : '#0C55B8',
              fontSize: '14px',
              fontWeight: isActive ? 700 : 400,
              transition: 'background-color 0.2s, color 0.2s',
              '&:hover': {
                backgroundColor: isActive ? '#002677' : 'rgba(0, 38, 119, 0.08)'
              },
              '&:focus-visible': {
                outline: '2px solid #002677',
                outlineOffset: 2
              }
            }}
          >
            {page}
          </Box>
        );
      })}

      <IconButton
        onClick={handleNextClick}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
        size="small"
        sx={{
          ml: 0.5,
          color: currentPage >= totalPages ? '#CBCCCD' : '#0C55B8',
          '&:hover': {
            backgroundColor: 'rgba(0, 38, 119, 0.08)'
          },
          '&.Mui-disabled': {
            color: '#CBCCCD'
          }
        }}
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};

export default Pagination;
