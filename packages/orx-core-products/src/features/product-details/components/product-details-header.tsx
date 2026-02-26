import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';

import {ProductDetailsHeaderProps} from '../types';

/**
 * ProductDetailsHeader component
 * Displays the page header with title, back button, and action buttons
 */
export const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({onAddProduct, onCancel}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1440px',
        backgroundColor: '#FAFCFF'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '31px',
          width: '1272px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
            padding: '10px 1px 24px',
            borderBottom: '1px solid #CBCCCD'
          }}
        >
          {/* Title Container */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            {/* Back Arrow */}
            <Box
              component="svg"
              sx={{
                width: '12px',
                height: '19px',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8
                }
              }}
              viewBox="0 0 12 19"
              fill="none"
              onClick={handleBackClick}
            >
              <path
                d="M10 2L2 9.5L10 17"
                stroke="#0C55B8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Box>

            {/* Title */}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '29px',
                lineHeight: '34.8px',
                color: '#002677'
              }}
            >
              Product Details
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
            {/* Add Product Button */}
            <Button
              variant="contained"
              onClick={onAddProduct}
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
                padding: '8px 24px 8px 16px',
                borderRadius: '46px',
                gap: '8px',
                '&:hover': {
                  backgroundColor: '#001a5c'
                }
              }}
            >
              Add Product
            </Button>

            {/* Cancel Button */}
            <Button
              variant="outlined"
              onClick={onCancel}
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
              Cancel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
