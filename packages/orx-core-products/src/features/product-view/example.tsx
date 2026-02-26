import React from 'react';

import {ProductViewPage} from './components';
import {useProductView} from './hooks';
import {ProductInformation, ProductAttribute} from './types';

/**
 * Example usage of ProductViewPage component
 * This demonstrates how to use the product view feature with sample data
 */
export const ProductViewExample: React.FC = () => {
  // Sample product information
  const sampleProductInformation: ProductInformation = {
    productCode: '201558',
    productName: 'Bridge to Wellness',
    productGroup: 'CLINICAL',
    productGroupDescription: 'Pharmacy Benefit Management - clinical solutions',
    baseUom: 'Basic points (bps)',
    productType: 'Standard unit',
    chargeType: 'Usage-Based',
    effectiveDate: '2024-01-15',
    expirationDate: '2025-12-31',
    lastModifiedBy: 'John Doe',
    lastModifiedDate: 'Jan 24 2026, 7:56:40 PM'
  };

  // Sample product attributes
  const sampleAttributes: ProductAttribute[] = [
    {
      productExtId: '1',
      productId: 'PROD001',
      attribute: 'DFLTREQ',
      attributeVal: 'PM (Per Month)',
      startDate: '12/24/2023',
      endDate: null
    },
    {
      productExtId: '2',
      productId: 'PROD001',
      attribute: 'DFLTREQ',
      attributeVal: 'PM (Per Month)',
      startDate: '12/24/2023',
      endDate: null
    },
    {
      productExtId: '3',
      productId: 'PROD001',
      attribute: 'DFLTREQ',
      attributeVal: 'PM (Per Month)',
      startDate: '12/24/2023',
      endDate: '-'
    }
  ];

  // Use the custom hook for state management
  const {
    productInformation,
    currentPage,
    pageSize,
    handleSave,
    handleCancel,
    handleRetire,
    handleDuplicate,
    handleAssignAttributes,
    handleEditAttribute,
    handleDeleteAttribute,
    handlePageChange
  } = useProductView({
    initialProductInformation: sampleProductInformation,
    initialAttributes: sampleAttributes,
    totalAttributesCount: 127, // Total count for pagination
    pageSize: 5
  });

  return (
    <ProductViewPage
      productInformation={productInformation}
      onSave={handleSave}
      onCancel={handleCancel}
      onRetire={handleRetire}
      onDuplicate={handleDuplicate}
      onAssignAttributes={handleAssignAttributes}
      onEditAttribute={handleEditAttribute}
      onDeleteAttribute={handleDeleteAttribute}
      onPageChange={handlePageChange}
      currentPage={currentPage}
      pageSize={pageSize}
    />
  );
};

export default ProductViewExample;
