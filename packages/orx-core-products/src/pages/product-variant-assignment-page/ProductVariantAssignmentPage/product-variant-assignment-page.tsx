import React from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';

import {ProductVariantAssignmentExample} from '../../../features/product-variant-assignment/example';

import {ProductVariantAssignmentPageProps} from './product-variant-assignment-page.types';

export function ProductVariantAssignmentPage(props: ProductVariantAssignmentPageProps) {
  const {text} = props;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('productId');
  const productGroup = searchParams.get('productGroup') || 'CORE'; // Default to CORE if not provided

  console.log({text, productId, productGroup});

  // If no productId in query params, redirect to product list
  React.useEffect(() => {
    if (!productId) {
      console.warn('No productId provided, redirecting to product list');
      navigate('/');
    }
  }, [productId, navigate]);

  if (!productId) {
    return null;
  }

  return <ProductVariantAssignmentExample productId={productId} productGroup={productGroup} />;
}

export default ProductVariantAssignmentPage;
