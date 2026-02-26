/* eslint-disable import/no-extraneous-dependencies */

'use client';

import React from 'react';
import {HashRouter, Routes, Route, Navigate} from 'react-router-dom';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {LookupPage} from '../../lookup-page/LookupPage/lookup-page';
import {LookupExtensionPage} from '../../lookup-extension-page/LookupExtensionPage/lookup-extension-page';
import {AttributePage} from '../../attribute-page/AttributePage/attribute-page';
import {VariantsPage} from '../../variants-page/VariantsPage/variants-page';
import {UnitOfMeasurePage} from '../../unit-of-measure-page/UnitOfMeasurePage/unit-of-measure-page';
import {AccountingCodePageWrapper} from '../../accounting-code-page/AccountingCodePage';
import {ProductGroup} from '../../product-group/ProductGroup/product-group';
import {BillCyclePage} from '../../bill-cycle-page/BillCyclePage/bill-cycle-page';

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
          <Route path="/" element={<LookupPage />} />
          <Route path="/lookup" element={<LookupPage />} />
          <Route path="/extension" element={<LookupExtensionPage text="Extension" />} />
          <Route path="/attribute" element={<AttributePage />} />
          <Route path="/variants" element={<VariantsPage />} />
          <Route path="/unitofmeasure" element={<UnitOfMeasurePage />} />
          <Route path="/accounting-code" element={<AccountingCodePageWrapper />} />
          <Route path="/product-groups" element={<ProductGroup />} />
          <Route path="/bill-cycle" element={<BillCyclePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </NotificationProvider>
    </HashRouter>
  );
}

export default Router;
