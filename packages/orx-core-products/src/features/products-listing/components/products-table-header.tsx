import React from 'react';
import {Box, Typography, Button} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';

import {ProductsTableHeaderProps} from '../types';

/**
 * ProductsTableHeader component
 * Displays the product count and action buttons (Add Product, Filters)
 */
export const ProductsTableHeader: React.FC<ProductsTableHeaderProps> = ({totalCount, onAddProduct, onFiltersClick}) => {
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
    >
      {/* Product Count */}
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '14px',
          lineHeight: '24px',
          color: '#000000',
          width: '644px'
        }}
      >
        Number of products: {totalCount}
      </Typography>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          height: '40px'
        }}
      >
        {/* Add Product Button */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddProduct}
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
          Add Product
        </Button>

        {/* Filters Button */}
        <Button
          variant="outlined"
          endIcon={<FilterListIcon />}
          onClick={onFiltersClick}
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
