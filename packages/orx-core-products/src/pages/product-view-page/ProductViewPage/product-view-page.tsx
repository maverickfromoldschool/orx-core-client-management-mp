import React from 'react';
import {
  ProductViewPage as ComponentProductViewPage,
  useProductView,
  ProductInformation,
  ProductAttribute
} from '@optum-rx-core/orx-core-products/src/features/product-view';

import {ProductViewPageProps} from './product-view-page.types';

export function ProductViewPage(props: ProductViewPageProps) {
  console.log({props});
  const productData: ProductInformation = {
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

  const attributes: ProductAttribute[] = [
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
      endDate: null
    }
  ];

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
    initialProductInformation: productData,
    initialAttributes: attributes,
    totalAttributesCount: 127,
    pageSize: 5
  });

  return (
    <ComponentProductViewPage
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
}

export default ProductViewPage;
