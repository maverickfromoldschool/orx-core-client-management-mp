/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import {Box, Chip, Typography} from '@mui/material';

import {ProductInfoSectionProps} from '../types';

/**
 * ProductInfoSection component
 * Displays product name, code, status badge, and key attributes
 */
export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({productDetails}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Product Header with Badge */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '64px'
        }}
      >
        {/* Product Name and Code */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '20px',
              lineHeight: '24px',
              color: '#000000',
              width: '240px'
            }}
          >
            {productDetails.product.productName}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '20px',
              color: '#323334'
            }}
          >
            {productDetails.product.productCode}
          </Typography>
        </Box>

        {/* Status Badge */}
        <Chip
          icon={
            <Box component="svg" sx={{width: '24px', height: '24px'}} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z"
                fill="#007000"
              />
            </Box>
          }
          label={productDetails.product.status}
          sx={{
            backgroundColor: '#EFF6EF',
            color: '#007000',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '19.6px',
            padding: '8px',
            gap: '4px',
            borderRadius: '4px',
            height: 'auto',
            '& .MuiChip-icon': {
              margin: 0,
              color: '#007000'
            }
          }}
        />
      </Box>

      {/* Product Attributes */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '56px'
        }}
      >
        {/* Product Type */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
            Product Type
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '22.4px',
              color: '#4B4D4F'
            }}
          >
            {productDetails.product.productType}
          </Typography>
        </Box>

        {/* Charge Type */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
            Charge Type
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '22.4px',
              color: '#4B4D4F'
            }}
          >
            {productDetails.product.chargeTypeCode}
          </Typography>
        </Box>

        {/* Effective Date */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
            Effective Date
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '16px',
              lineHeight: '22.4px',
              color: '#4B4D4F'
            }}
          >
            {productDetails.product.effectiveDate}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
