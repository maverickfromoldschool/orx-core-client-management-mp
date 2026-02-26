import React from 'react';
import {Box, Button, FormControl, Select, MenuItem, Typography} from '@mui/material';
import type {SelectChangeEvent} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/** Bulk action types */
export type BulkAction = 'delete' | '';

/**
 * Props for the VariantAssignmentActionBar component
 */
export interface VariantAssignmentActionBarProps {
  /** Total number of variant assignments */
  totalCount: number;
  /** Callback when Assign Variants button is clicked */
  onAssignVariants: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
  /** Callback when bulk action is applied */
  onBulkAction: (action: BulkAction) => void;
  /** Whether bulk actions are disabled */
  bulkActionsDisabled?: boolean;
}

/**
 * VariantAssignmentActionBar component displays action buttons and bulk actions
 * Following the same pattern as variants-page and client-list-page
 * Requirements: 1.4, 3.5, 4.1, 7.1, 7.2, 8.1, 12.3
 */
export const VariantAssignmentActionBar: React.FC<VariantAssignmentActionBarProps> = ({
  totalCount,
  onAssignVariants,
  onFiltersClick,
  onBulkAction,
  bulkActionsDisabled = false
}) => {
  const [selectedAction, setSelectedAction] = React.useState<BulkAction>('');

  const handleActionChange = (event: SelectChangeEvent<BulkAction>) => {
    setSelectedAction(event.target.value as BulkAction);
  };

  const handleApply = () => {
    if (selectedAction && !bulkActionsDisabled) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

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
      {/* Left side - Variant assignment count */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#4B4D4F',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
          }}
          aria-live="polite"
          aria-atomic="true"
        >
          Number of variant assignments: {totalCount}
        </Typography>
      </Box>

      {/* Right side - Action buttons */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        {/* Apply link */}
        <Typography
          component="span"
          onClick={handleApply}
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#0C55B8',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          Apply
        </Typography>

        {/* Bulk actions dropdown */}
        <FormControl size="small" sx={{minWidth: 140}}>
          <Select
            value={selectedAction}
            onChange={handleActionChange}
            displayEmpty
            IconComponent={KeyboardArrowDownIcon}
            sx={{
              fontSize: '14px',
              color: '#4B4D4F',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif',
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
                return 'Bulk actions';
              }
              return value.charAt(0).toUpperCase() + value.slice(1);
            }}
          >
            <MenuItem value="" disabled>
              Bulk actions
            </MenuItem>
            <MenuItem value="delete">Delete</MenuItem>
          </Select>
        </FormControl>

        {/* Assign Variants button */}
        <Button
          startIcon={<AddIcon />}
          onClick={onAssignVariants}
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
          Assign Variants
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
