import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * Props for the PriceListActionBar component
 */
export interface PriceListActionBarProps {
  /** Total number of items */
  totalItems: number;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
}

/**
 * PriceListActionBar component displays action buttons for the price list
 */
export const PriceListActionBar: React.FC<PriceListActionBarProps> = ({totalItems, onFiltersClick}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        gap: '12px'
      }}
    >
      {/* Left side - Item count */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#4B4D4F',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
          }}
        >
          Number of items: {totalItems}
        </Typography>
      </Box>

      {/* Right side - Action buttons */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        {/* Filters button */}
        <Button
          startIcon={<FilterListIcon />}
          onClick={onFiltersClick}
          variant="outlined"
          sx={{
            borderColor: '#002677',
            color: '#002677',
            borderRadius: '46px',
            padding: '6px 16px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              borderColor: '#001a5c',
              backgroundColor: 'rgba(0, 38, 119, 0.04)'
            }
          }}
        >
          Filters
        </Button>
      </Box>
    </Box>
  );
};

export default PriceListActionBar;
