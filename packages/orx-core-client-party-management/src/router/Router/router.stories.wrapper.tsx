import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {HashRouter, Route, Routes} from 'react-router-dom';

export const WithRouterContext = ({children}: {children: React.ReactNode}) => (
  <HashRouter>
    <Routes>
      <Route path="/" element={children} />
    </Routes>
  </HashRouter>
);
