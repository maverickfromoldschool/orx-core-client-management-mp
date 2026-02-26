import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {HashRouter, Route, Routes} from 'react-router-dom';

import type {OrxCorePricingContextProps} from '../../orx-core-pricing-provider/OrxCorePricingProvider/orx-core-pricing-provider.types';
import {
  WithOrxCorePricingContext,
  defaultContext
} from '../../orx-core-pricing-provider/OrxCorePricingProvider/orx-core-pricing-provider.stories.context';

export const WithRouterContext = ({
  children,
  context = defaultContext
}: {
  children: React.ReactNode;
  context?: OrxCorePricingContextProps;
}) => (
  <WithOrxCorePricingContext context={context}>
    <HashRouter>
      <Routes>
        <Route path="/" element={children} />
      </Routes>
    </HashRouter>
  </WithOrxCorePricingContext>
);
