/* eslint-disable import/no-extraneous-dependencies */

'use client';

import React from 'react';
import {HashRouter, Routes, Route, Navigate} from 'react-router-dom';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {ClientListPage} from '../../client-list-page/ClientListPage/client-list-page';
import {AddClientPage} from '../../add-client-page/AddClientPage/add-client-page';
import {ViewClientPage} from '../../view-client-page/ViewClientPage/view-client-page';
import EditClientPage from '../../edit-client-page/EditClientPage/edit-client-page';
import {ManageCagsPage} from '../../manage-cags/ManageCags/manage-cags';

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
          <Route path="/" element={<ClientListPage />} />
          <Route path="/client-list" element={<ClientListPage />} />
          <Route path="/add-client" element={<AddClientPage />} />
          <Route path="/view-client/:clientId" element={<ViewClientPage />} />
          <Route path="/edit-client" element={<EditClientPage />} />
          <Route path="/manage-cags" element={<ManageCagsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </NotificationProvider>
    </HashRouter>
  );
}

export default Router;
