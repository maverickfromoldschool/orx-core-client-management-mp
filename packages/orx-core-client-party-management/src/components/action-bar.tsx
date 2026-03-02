import React from 'react';
import {Box, Button, FormControl, Select, MenuItem, Typography, Menu, ButtonGroup} from '@mui/material';
import type {SelectChangeEvent} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

/** Bulk action types */
export type BulkAction = 'delete' | 'export' | 'archive' | '';

/**
 * Props for the ActionBar component
 */
export interface ActionBarProps {
  /** Total number of clients */
  totalClients: number;
  /** Callback when Add Client button is clicked */
  onAddClient: () => void;
  /** Callback when Show Details button is clicked */
  onShowDetails: () => void;
  /** Callback when Filters button is clicked */
  onFiltersClick: () => void;
  /** Callback when bulk action is applied */
  onBulkAction: (action: BulkAction) => void;
}

/**
 * ActionBar component displays action buttons and bulk actions for the client list
 * Requirements: 4.1, 4.2, 5.1, 5.3, 5.4, 5.5
 */
export const ActionBar: React.FC<ActionBarProps> = ({
  totalClients,
  onAddClient,
  onShowDetails,
  onFiltersClick,
  onBulkAction
}) => {
  const [selectedAction, setSelectedAction] = React.useState<BulkAction>('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleActionChange = (event: SelectChangeEvent<BulkAction>) => {
    setSelectedAction(event.target.value as BulkAction);
  };

  const handleApply = () => {
    if (selectedAction) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOption = (option: string) => {
    // eslint-disable-next-line no-console
    console.log('Menu option selected:', option);
    handleMenuClose();
    // You can add specific handlers for each option here
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
      {/* Left side - Client count */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        {/* Client count - Requirements: 5.5 */}
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#4B4D4F',
            fontFamily: '"Optum Sans", "Enterprise Sans VF", sans-serif'
          }}
        >
          Number of clients: {totalClients}
        </Typography>
      </Box>

      {/* Right side - Action buttons */}
      <Box sx={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        {/* Apply link - Requirements: 4.2 */}
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

        {/* Bulk actions dropdown - Requirements: 4.1 */}
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
            <MenuItem value="export">Export</MenuItem>
            <MenuItem value="archive">Archive</MenuItem>
          </Select>
        </FormControl>

        {/* Add Client button - Requirements: 5.1 */}
        <ButtonGroup variant="contained" size="small" sx={{borderRadius: '46px', overflow: 'hidden'}}>
          <Button
            startIcon={<AddIcon />}
            onClick={onAddClient}
            sx={{
              backgroundColor: '#002677',
              color: '#FFFFFF',
              borderRadius: '46px 0 0 46px',
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
            Add Client
          </Button>
          <Button
            size="small"
            onClick={handleMenuClick}
            sx={{
              backgroundColor: '#002677',
              color: '#FFFFFF',
              borderRadius: '0 46px 46px 0',
              padding: '6px 8px',
              minWidth: '32px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
              '&:hover': {
                backgroundColor: '#001a5c'
              }
            }}
          >
            <KeyboardArrowDownIcon />
          </Button>
        </ButtonGroup>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuOption('option1');
            }}
          >
            Add a New Client
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuOption('option2');
            }}
          >
            Bulk upload Clients
          </MenuItem>
        </Menu>

        {/* Manage CAGs button - Requirements: 5.3 */}
        <Button
          variant="outlined"
          size="small"
          onClick={onShowDetails}
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
          Manage CAGs
        </Button>

        {/* Filters button - Requirements: 5.4 */}
        <Button
          variant="outlined"
          size="small"
          endIcon={<FilterListIcon sx={{fontSize: '16px'}} />}
          onClick={onFiltersClick}
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

export default ActionBar;
