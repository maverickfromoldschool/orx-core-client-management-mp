/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import {Card} from '@mui/material';

import {ProductDetailsCardProps} from '../types';

import {ProductInfoSection} from './product-info-section';
import {ProductSummaryCards} from './product-summary-cards';
import {ProductActions} from './product-actions';

/**
 * ProductDetailsCard component
 * Main card container that combines all product detail sections
 */
export const ProductDetailsCard: React.FC<ProductDetailsCardProps> = ({
  productDetails,
  onViewDetails,
  onAddNew,
  onRetire
}) => {
  return (
    <Card
      sx={{
        width: '1268px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #CBCCCD',
        borderRadius: '12px',
        boxShadow: 'none',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '32px'
      }}
    >
      {/* Product Info Section */}
      <ProductInfoSection productDetails={productDetails} />

      {/* Summary Cards */}
      <ProductSummaryCards productDetails={productDetails} onViewDetails={onViewDetails} />

      {/* Actions Section */}
      <ProductActions
        createdBy={productDetails.product.createdBy}
        createdDate={productDetails.product.createdDate}
        lastModifiedBy={productDetails.product.modifiedBy}
        lastModifiedDate={productDetails.product.modifiedDate}
        onAddNew={onAddNew}
        onRetire={onRetire}
      />
    </Card>
  );
};
