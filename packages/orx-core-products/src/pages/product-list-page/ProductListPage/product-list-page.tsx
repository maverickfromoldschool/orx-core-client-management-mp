/* eslint-disable no-console */
import React from 'react';
import {useNavigate} from 'react-router-dom';

import {ProductsListingPage} from '../../../features/products-listing';
import {Product} from '../../../features/products-listing/types';

import {ProductListPageProps} from './product-list-page.types';

export function ProductListPage(props: ProductListPageProps) {
  console.log({props});
  const navigate = useNavigate();

  const handleEdit = (product: Product) => {
    console.log('Edit product:', product.id, product.product);

    navigate(`/details/${product.id}`);
  };

  const handleCopy = (product: Product) => {
    console.log('Copy product:', product.id, product.product);
  };

  return (
    <div>
      <ProductsListingPage onEdit={handleEdit} onCopy={handleCopy} initialPage={1} pageSize={10} />
    </div>
  );
}

export default ProductListPage;
