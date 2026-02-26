'use client';

import React from 'react';
import {HashRouter, Routes, Route, Navigate} from 'react-router-dom';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {PriceListPage} from '../../price-list-page/PriceListPage/price-list-page';
import {PriceListDetailsPage} from '../../price-list-details-page/PriceListDetailsPage/price-list-details-page';
import {PriceListEntryDetailsPage} from '../../price-list-entry-details-page/PriceListEntryDetailsPage/price-list-entry-details-page';

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
          <Route path="/" element={<Navigate to="/price-lists" replace />} />
          <Route path="/price-lists" element={<PriceListPage />} />
          <Route path="/price-lists/:priceListId" element={<PriceListDetailsPage />} />
          <Route path="/price-lists/:priceListId/entries/:entryId" element={<PriceListEntryDetailsPage />} />
          <Route path="*" element={<Navigate to="/price-lists" />} />
        </Routes>
      </NotificationProvider>
    </HashRouter>
  );
}

export default Router;
