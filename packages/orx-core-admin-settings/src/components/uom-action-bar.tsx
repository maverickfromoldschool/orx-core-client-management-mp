import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * Props for the UomActionBar component
 */
export interface UomActionBarProps {
  /** Total number of UOM items */
  totalItems: number;
  /** Callback when Add New button is clicked */
  onAdd: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
}

/**
 * UomActionBar component displays action buttons and item count
 */
export const UomActionBar: React.FC<UomActionBarProps> = ({totalItems, onAdd, onFiltersClick}) => {
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
            color: '#4B4D4F',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
          }}
        >
          <Box component="span" sx={{fontWeight: 700}}>
            Number of items:
          </Box>{' '}
          {totalItems}
        </Typography>
      </Box>

      {/* Right side - Action buttons */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        {/* Add New button */}
        <Button
          startIcon={<AddIcon />}
          onClick={onAdd}
          variant="contained"
          sx={{
            backgroundColor: '#002677',
            color: '#FFFFFF',
            borderRadius: '46px',
            padding: '6px 16px',
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'none',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              backgroundColor: '#001a5c'
            }
          }}
        >
          Add New
        </Button>

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

export default UomActionBar;
