import React, {useState} from 'react';
import {Box, Button, Menu, MenuItem, Typography} from '@mui/material';

import {ProductActionsProps} from '../types';

/**
 * ProductActions component
 * Displays creation/modification info and action buttons (Duplicate, Add New, Retire)
 */
export const ProductActions: React.FC<ProductActionsProps> = ({
  createdBy,
  createdDate,
  lastModifiedBy,
  lastModifiedDate,
  onDuplicate,
  onAddNew,
  onRetire
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAddNewClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (type: 'relationship' | 'variant') => {
    onAddNew?.(type);
    handleClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '16px',
        height: '48px'
      }}
    >
      {/* Creation and Modification Info */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '64px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '4px'
          }}
        >
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '19.6px',
              color: '#4B4D4F'
            }}
          >
            Created By: {createdBy} on {createdDate}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '19.6px',
              color: '#4B4D4F'
            }}
          >
            Last Modified By: {lastModifiedBy} on {lastModifiedDate}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {/* Duplicate Button */}
          <Button
            variant="outlined"
            onClick={onDuplicate}
            startIcon={
              <Box component="svg" sx={{width: '24px', height: '24px'}} viewBox="0 0 24 24" fill="none">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#002677" />
              </Box>
            }
            sx={{
              backgroundColor: '#FBF9F4',
              color: '#002677',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '22.4px',
              textTransform: 'none',
              padding: '8px 24px 8px 16px',
              borderRadius: '46px',
              border: '1px solid #002677',
              gap: '8px',
              '&:hover': {
                backgroundColor: '#f5f0e8',
                border: '1px solid #002677'
              }
            }}
          >
            Duplicate
          </Button>

          {/* Add New Button with Dropdown */}
          <Box sx={{position: 'relative'}}>
            <Button
              variant="contained"
              onClick={handleAddNewClick}
              endIcon={
                <Box component="svg" sx={{width: '20px', height: '20px'}} viewBox="0 0 20 20" fill="none">
                  <path d="M5.35 7.5L10 12.15L14.65 7.5" stroke="currentColor" strokeWidth="2" />
                </Box>
              }
              startIcon={
                <Box component="svg" sx={{width: '24px', height: '24px'}} viewBox="0 0 24 24" fill="none">
                  <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
                </Box>
              }
              sx={{
                backgroundColor: '#002677',
                color: '#FBF9F4',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '22.4px',
                textTransform: 'none',
                padding: '8px 16px',
                borderRadius: '46px',
                gap: '8px',
                '&:hover': {
                  backgroundColor: '#001a5c'
                }
              }}
            >
              Add New
            </Button>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              sx={{
                '& .MuiPaper-root': {
                  width: '190px',
                  border: '1px solid #929496',
                  borderRadius: '4px',
                  boxShadow: '0px 2px 6px 0px rgba(25, 25, 26, 0.16)',
                  marginTop: '4px'
                }
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuItemClick('relationship');
                }}
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#4B4D4F',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Product Relationship
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuItemClick('variant');
                }}
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '22.4px',
                  color: '#4B4D4F',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                Product Variant
              </MenuItem>
            </Menu>
          </Box>

          {/* Retire Button */}
          <Button
            variant="outlined"
            onClick={onRetire}
            sx={{
              backgroundColor: '#FFFFFF',
              color: '#323334',
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '22.4px',
              textTransform: 'none',
              padding: '10px 24px',
              borderRadius: '46px',
              border: '1px solid #323334',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                border: '1px solid #323334'
              }
            }}
          >
            Retire
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
