import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import {ProductDetailsPage as FeatureProductDetailsPage, ProductDetails} from '../../../features/product-details';

import {ProductDetailsPageProps} from './product-details-page.types';

export function ProductDetailsPage(props: ProductDetailsPageProps) {
  console.log({props});
  const navigate = useNavigate();
  const {productId} = useParams();
  console.log({productId});

  const productDetails: ProductDetails = {
    id: '1',
    name: 'Deposit',
    code: '00020',
    productType: 'Standard Unit',
    chargeType: 'Usage-Based',
    effectiveDate: '01/01/2025',
    status: 'active' as const,
    createdBy: 'John Doe',
    createdDate: 'Jan 24 2026, 7:56:40 PM',
    lastModifiedBy: 'John Doe',
    lastModifiedDate: 'Jan 24 2026, 7:56:40 PM'
  };

  const cardData = {
    productInformation: {
      attributesCount: 2,
      transactionLabelsCount: 3
    },
    productRelationship: {
      count: 0
    },
    productVariant: {
      count: 1
    },
    priceListEntry: {
      count: 1
    }
  };

  const viewDetailsHandler = (type: 'information' | 'relationship' | 'variant' | 'priceList') => {
    if (type === 'information') {
      navigate(`/view/${productDetails.id}`);
    } else if (type === 'variant') {
      navigate(`/product-variant-assignment`);
    }
  };

  return (
    <FeatureProductDetailsPage
      productDetails={productDetails}
      cardData={cardData}
      onAddProduct={() => {
        console.log('Add product');
      }}
      onCancel={() => {
        console.log('Cancel');
      }}
      onDuplicate={() => {
        console.log('Duplicate');
      }}
      onAddNew={(type) => {
        console.log('Add new', type);
        navigate(`/product-variant-assignment`);
      }}
      onRetire={() => {
        console.log('Retire');
      }}
      onViewDetails={viewDetailsHandler}
    />
  );
}

export default ProductDetailsPage;
