'use client';

import React from 'react';
import {HashRouter, Routes, Route, Navigate} from 'react-router-dom';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {ProductListPage} from '../../pages/product-list-page/ProductListPage/product-list-page';
import {ProductDetailsPage} from '../../pages/product-details-page/ProductDetailsPage/product-details-page';
import {ProductViewPage} from '../../pages/product-view-page/ProductViewPage/product-view-page';
import {ProductVariantAssignmentPage} from '../../pages/product-variant-assignment-page/ProductVariantAssignmentPage/product-variant-assignment-page';

export function Router() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <p>Loading</p>
  ) : (
    <HashRouter>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<ProductListPage text="Product List Page" />} />
          <Route path="/details/:productId" element={<ProductDetailsPage text="Product Details Page" />} />
          <Route path="/product-details/:productId" element={<ProductDetailsPage text="Product Details Page" />} />
          <Route path="/product-information/:productId" element={<ProductViewPage text="Product View Page" />} />
          <Route
            path="/product-variant-assignment"
            element={<ProductVariantAssignmentPage text="Product - Product Variant Assignment" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </NotificationProvider>
    </HashRouter>
  );
}

export default Router;
