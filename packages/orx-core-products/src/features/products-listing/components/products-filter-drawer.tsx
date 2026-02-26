import React, {useState} from 'react';
import {Drawer, Box, Typography, TextField, Button, IconButton, MenuItem} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import {ProductsFilterDrawerProps, ProductFilters} from '../types';

/**
 * ProductsFilterDrawer component
 * Side drawer for filtering products with multiple criteria
 */
export const ProductsFilterDrawer: React.FC<ProductsFilterDrawerProps> = ({
  open,
  onClose,
  onApplyFilters,
  initialFilters
}) => {
  const [filters, setFilters] = useState<ProductFilters>(
    initialFilters || {
      product: '',
      productCode: '',
      productGroup: '',
      productType: '',
      chargeType: '',
      effectiveDate: '',
      status: ''
    }
  );

  /**
   * Handle input change for text fields
   */
  const handleInputChange = (field: keyof ProductFilters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value
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
    const clearedFilters: ProductFilters = {
      product: '',
      productCode: '',
      productGroup: '',
      productType: '',
      chargeType: '',
      effectiveDate: '',
      status: ''
    };
    setFilters(clearedFilters);
    onApplyFilters?.(clearedFilters);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '400px',
          padding: '24px'
        }
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
            aria-label="close filters"
            sx={{
              color: '#4B4D4F'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Subtitle */}
        <Typography
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
        >
          {/* Product */}
          <div>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px'
              }}
            >
              Product
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter product"
              value={filters.product}
              onChange={handleInputChange('product')}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* Product Code */}
          <div>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px'
              }}
            >
              Product Code
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter product code"
              value={filters.productCode}
              onChange={handleInputChange('productCode')}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* Product Group */}
          <div>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px'
              }}
            >
              Product Group
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter product group"
              value={filters.productGroup}
              onChange={handleInputChange('productGroup')}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* Product Type */}
          <div>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px'
              }}
            >
              Product Type
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter product type"
              value={filters.productType}
              onChange={handleInputChange('productType')}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* Charge Type */}
          <div>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px'
              }}
            >
              Charge Type
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter charge type"
              value={filters.chargeType}
              onChange={handleInputChange('chargeType')}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* Effective Date */}
          <div>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px'
              }}
            >
              Effective Date
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter effective date"
              value={filters.effectiveDate}
              onChange={handleInputChange('effectiveDate')}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            />
          </div>

          {/* Status */}
          <div>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: '14px',
                lineHeight: '19.6px',
                color: '#000000',
                marginBottom: '8px'
              }}
            >
              Status
            </Typography>
            <TextField
              fullWidth
              select
              placeholder="Select status"
              value={filters.status}
              onChange={handleInputChange('status')}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#FFFFFF'
                }
              }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </TextField>
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
        >
          <Button
            variant="outlined"
            onClick={handleClearFilters}
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
              }
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleApplyFilters}
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
