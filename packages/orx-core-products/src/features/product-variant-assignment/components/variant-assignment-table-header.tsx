import React, {useState} from 'react';
import {Box, Typography, Button, Menu, MenuItem, CircularProgress} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {VariantAssignmentTableHeaderProps} from '../types';

/**
 * VariantAssignmentTableHeader component
 * Displays the variant assignment count and action buttons (Assign Variants, Bulk Actions, Filters)
 *
 * Requirements: 1.4, 3.5, 4.1, 7.1, 7.2, 8.1, 12.3
 */
export const VariantAssignmentTableHeader: React.FC<VariantAssignmentTableHeaderProps> = ({
  totalCount,
  selectedCount,
  onAssignVariants,
  onBulkDelete,
  onFiltersClick,
  bulkActionsDisabled,
  loading = false
}) => {
  const [bulkActionsAnchorEl, setBulkActionsAnchorEl] = useState<null | HTMLElement>(null);
  const bulkActionsOpen = Boolean(bulkActionsAnchorEl);

  const handleBulkActionsClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!bulkActionsDisabled) {
      setBulkActionsAnchorEl(event.currentTarget);
    }
  };

  const handleBulkActionsClose = () => {
    setBulkActionsAnchorEl(null);
  };

  const handleBulkDelete = () => {
    handleBulkActionsClose();
    onBulkDelete();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '40px',
        gap: '64px'
      }}
      role="region"
      aria-label="Variant assignment table controls"
    >
      {/* Variant Assignment Count */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '24px',
          color: '#000000',
          width: '644px'
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        Number of variant assignments: {totalCount}
      </Typography>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '40px'
        }}
        role="toolbar"
        aria-label="Table actions"
      >
        {/* Apply Label and Bulk Actions Dropdown */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {/* Apply Label */}
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '22.4px',
              color: '#002677',
              opacity: bulkActionsDisabled ? 0.5 : 1
            }}
          >
            Apply
          </Typography>

          {/* Bulk Actions Dropdown */}
          <Box
            onClick={handleBulkActionsClick}
            role="button"
            tabIndex={bulkActionsDisabled || loading ? -1 : 0}
            aria-label="Bulk actions menu"
            aria-haspopup="true"
            aria-expanded={bulkActionsOpen}
            aria-disabled={bulkActionsDisabled || loading}
            onKeyDown={(e) => {
              if (!bulkActionsDisabled && !loading && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleBulkActionsClick(e as any);
              }
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '40px',
              padding: '8px 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9D9D9',
              borderRadius: '4px',
              cursor: bulkActionsDisabled || loading ? 'not-allowed' : 'pointer',
              opacity: bulkActionsDisabled || loading ? 0.5 : 1,
              minWidth: '140px',
              '&:hover': {
                backgroundColor: bulkActionsDisabled || loading ? '#FFFFFF' : '#f5f5f5'
              },
              '&:focus': {
                outline: '2px solid #0066F5',
                outlineOffset: '2px'
              }
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{color: '#323334'}} />
            ) : (
              <>
                <Typography
                  sx={{
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '22.4px',
                    color: '#323334'
                  }}
                >
                  Bulk actions
                </Typography>
                <KeyboardArrowDownIcon
                  sx={{
                    fontSize: '20px',
                    color: '#323334'
                  }}
                />
              </>
            )}
          </Box>

          {/* Bulk Actions Menu */}
          <Menu
            anchorEl={bulkActionsAnchorEl}
            open={bulkActionsOpen}
            onClose={handleBulkActionsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            aria-label="Bulk actions menu"
          >
            <MenuItem onClick={handleBulkDelete} aria-label={`Delete ${selectedCount} selected variant assignments`}>
              Delete Selected ({selectedCount})
            </MenuItem>
          </Menu>
        </Box>

        {/* Assign Variants Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAssignVariants}
          aria-label="Assign new variant"
          sx={{
            backgroundColor: '#002677',
            color: '#FBF9F4',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '22.4px',
            textTransform: 'none',
            height: '40px',
            borderRadius: '46px',
            gap: '10px',
            padding: '10px 24px',
            opacity: 1,
            '&:hover': {
              backgroundColor: '#001a5c'
            },
            '& .MuiButton-startIcon': {
              marginRight: '0'
            }
          }}
        >
          Assign Variants
        </Button>

        {/* Filters Button */}
        <Button
          variant="outlined"
          endIcon={<FilterListIcon />}
          onClick={onFiltersClick}
          aria-label="Open filters"
          sx={{
            backgroundColor: '#FFFFFF',
            color: '#323334',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '22.4px',
            textTransform: 'none',
            height: '40px',
            borderRadius: '46px',
            borderColor: '#323334',
            borderWidth: '1px',
            gap: '10px',
            padding: '10px 24px',
            opacity: 1,
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#323334',
              borderWidth: '1px'
            },
            '& .MuiButton-endIcon': {
              marginLeft: '0'
            }
          }}
        >
          Filters
        </Button>
      </Box>
    </Box>
  );
};
