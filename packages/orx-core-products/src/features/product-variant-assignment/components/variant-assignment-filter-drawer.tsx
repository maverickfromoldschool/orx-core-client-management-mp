import React, {useState, useEffect, useRef} from 'react';
import {Drawer, Box, Typography, TextField, Button, IconButton, MenuItem} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {VariantAssignmentFilterDrawerProps, VariantAssignmentFilters} from '../types';
import {handleFocusTrap, saveFocusedElement, restoreFocusedElement, focusFirstElement} from '../utils/focus-trap';

/**
 * VariantAssignmentFilterDrawer component
 * Side drawer for filtering variant assignments with multiple criteria
 *
 * Features:
 * - Boolean filters for Predefined List, Transaction Processing, Price Determination
 * - Date range filters for Start Date and End Date
 * - Apply and Clear buttons
 * - Responsive design following Optum design system
 */
export const VariantAssignmentFilterDrawer: React.FC<VariantAssignmentFilterDrawerProps> = ({
  open,
  onClose,
  onApplyFilters,
  initialFilters,
  loading = false
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<VariantAssignmentFilters>(
    initialFilters || {
      transactionProcessing: null,
      priceDetermination: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null
    }
  );

  // Update local state when initialFilters change
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

  /**
   * Handle focus trap and focus management
   */
  useEffect(() => {
    if (open) {
      // Save the element that opened the drawer
      saveFocusedElement();

      // Focus the first element in the drawer after a short delay
      const timer = setTimeout(() => {
        if (drawerRef.current) {
          focusFirstElement(drawerRef.current);
        }
      }, 100);

      // Add keyboard event listener for focus trap
      const handleKeyDown = (event: KeyboardEvent) => {
        if (drawerRef.current) {
          handleFocusTrap(event, drawerRef.current);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }

    // Restore focus when drawer closes
    restoreFocusedElement();
    return undefined;
  }, [open]);

  /**
   * Handle boolean filter change
   */
  const handleBooleanChange =
    (field: 'predefinedList' | 'transactionProcessing' | 'priceDetermination') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const {value} = event.target;
      setFilters((prev) => ({
        ...prev,
        [field]: value === '' ? null : value === 'true'
      }));
    };

  /**
   * Handle date filter change
   */
  const handleDateChange =
    (field: 'startDateFrom' | 'startDateTo' | 'endDateFrom' | 'endDateTo') =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilters((prev) => ({
        ...prev,
        [field]: event.target.value || null
      }));
    };

  /**
   * Handle filter application
   */
  const handleApplyFilters = () => {
    onApplyFilters?.(filters);
    onClose();
  };

  /**
   * Handle clear filters
   */
  const handleClearFilters = () => {
    const clearedFilters: VariantAssignmentFilters = {
      transactionProcessing: null,
      priceDetermination: null,
      startDateFrom: null,
      startDateTo: null,
      endDateFrom: null,
      endDateTo: null
    };
    setFilters(clearedFilters);
    onApplyFilters?.(clearedFilters);
  };

  /**
   * Convert boolean filter value to string for select
   */
  const getBooleanValue = (value: boolean | null | undefined): string => {
    if (value === true) return 'true';
    if (value === false) return 'false';
    return '';
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      aria-labelledby="filter-drawer-title"
      aria-describedby="filter-drawer-description"
      PaperProps={{
        ref: drawerRef,
        sx: {
          width: '400px',
          padding: '24px'
        },
        role: 'dialog'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          <Typography
            id="filter-drawer-title"
            sx={{
              fontWeight: 700,
              fontSize: '24px',
              lineHeight: '32px',
              color: '#000000'
            }}
          >
            Filters
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close filters"
            sx={{
              color: '#4B4D4F'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Subtitle */}
        <Typography
          id="filter-drawer-description"
          sx={{
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '19.6px',
            color: '#4B4D4F',
            marginBottom: '32px'
          }}
        >
          Select the filtering options to fetch the required data
        </Typography>

        {/* Filter Fields */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flex: 1,
            overflowY: 'auto',
            marginBottom: '24px'
          }}
          role="form"
          aria-label="Filter options"
        >
          {/* Transaction Processing */}
          <div>
            <Typography
              component="label"
              htmlFor="filter-transaction-processing"
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              Transaction Processing
            </Typography>
            <TextField
              id="filter-transaction-processing"
              fullWidth
              select
              value={getBooleanValue(filters.transactionProcessing)}
              onChange={handleBooleanChange('transactionProcessing')}
              variant="outlined"
              size="small"
              disabled={loading}
              inputProps={{
                'aria-label': 'Filter by Transaction Processing'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </div>

          {/* Price Determination */}
          <div>
            <Typography
              component="label"
              htmlFor="filter-price-determination"
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              Price Determination
            </Typography>
            <TextField
              id="filter-price-determination"
              fullWidth
              select
              value={getBooleanValue(filters.priceDetermination)}
              onChange={handleBooleanChange('priceDetermination')}
              variant="outlined"
              size="small"
              disabled={loading}
              inputProps={{
                'aria-label': 'Filter by Price Determination'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </div>

          {/* Start Date From */}
          <div>
            <Typography
              component="label"
              htmlFor="filter-start-date-from"
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              Start Date From
            </Typography>
            <TextField
              id="filter-start-date-from"
              fullWidth
              type="date"
              value={filters.startDateFrom || ''}
              onChange={handleDateChange('startDateFrom')}
              variant="outlined"
              size="small"
              disabled={loading}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                'aria-label': 'Filter by Start Date From'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* Start Date To */}
          <div>
            <Typography
              component="label"
              htmlFor="filter-start-date-to"
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              Start Date To
            </Typography>
            <TextField
              id="filter-start-date-to"
              fullWidth
              type="date"
              value={filters.startDateTo || ''}
              onChange={handleDateChange('startDateTo')}
              variant="outlined"
              size="small"
              disabled={loading}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                'aria-label': 'Filter by Start Date To'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* End Date From */}
          <div>
            <Typography
              component="label"
              htmlFor="filter-end-date-from"
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              End Date From
            </Typography>
            <TextField
              id="filter-end-date-from"
              fullWidth
              type="date"
              value={filters.endDateFrom || ''}
              onChange={handleDateChange('endDateFrom')}
              variant="outlined"
              size="small"
              disabled={loading}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                'aria-label': 'Filter by End Date From'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* End Date To */}
          <div>
            <Typography
              component="label"
              htmlFor="filter-end-date-to"
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px',
                display: 'block'
              }}
            >
              End Date To
            </Typography>
            <TextField
              id="filter-end-date-to"
              fullWidth
              type="date"
              value={filters.endDateTo || ''}
              onChange={handleDateChange('endDateTo')}
              variant="outlined"
              size="small"
              disabled={loading}
              InputLabelProps={{
                shrink: true
              }}
              inputProps={{
                'aria-label': 'Filter by End Date To'
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            paddingBottom: '48px'
          }}
          role="group"
          aria-label="Filter actions"
        >
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            disabled={loading}
            aria-label="Clear all filters"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '22.4px',
              color: '#0C55B8',
              borderColor: '#0C55B8',
              height: '40px',
              borderRadius: '46px',
              gap: '10px',
              padding: '10px 24px',
              opacity: 1,
              '&:hover': {
                borderColor: '#003d99',
                backgroundColor: 'rgba(12, 85, 184, 0.04)'
              },
              '&:disabled': {
                opacity: 0.5
              }
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyFilters}
            disabled={loading}
            aria-label="Apply filters"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '22.4px',
              backgroundColor: '#002677',
              color: '#FBF9F4',
              height: '40px',
              borderRadius: '46px',
              gap: '10px',
              padding: '10px 24px',
              opacity: 1,
              '&:hover': {
                backgroundColor: '#001a5c'
              },
              '&:disabled': {
                opacity: 0.5
              }
            }}
          >
            Filter
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
