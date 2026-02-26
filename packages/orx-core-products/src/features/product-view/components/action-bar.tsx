import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * Props for the ActionBar component
 */
export interface ActionBarProps {
  /** Total number of items */
  totalItems: number;
  /** Callback when Add New button is clicked */
  onAdd: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick?: () => void;
  /** Whether to show the Filters button */
  showFilters?: boolean;
}

/**
 * ActionBar component displays action buttons for the list
 */
export const ActionBar: React.FC<ActionBarProps> = ({totalItems, onAdd, onFiltersClick, showFilters = true}) => {
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
        {showFilters && onFiltersClick && (
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
        )}
      </Box>
    </Box>
  );
};

export default ActionBar;
