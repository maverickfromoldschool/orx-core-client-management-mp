import React from 'react';

import {OrxCorePricingContextProps} from './orx-core-pricing-provider.types';
import {OrxCorePricingProvider} from './orx-core-pricing-provider';

export const mockContext: OrxCorePricingContextProps = {
  onClickLink: jest.fn()
};

export const WithMockOrxCorePricingContext = ({
  children,
  context = mockContext
}: {
  children: React.ReactNode;
  context?: OrxCorePricingContextProps;
}) => <OrxCorePricingProvider {...context}>{children}</OrxCorePricingProvider>;

export const WithMockOrxCorePricingCustomContext =
  (customContext: OrxCorePricingContextProps) =>
  ({children, context = customContext}: {children: React.ReactNode; context?: OrxCorePricingContextProps}) => (
    <OrxCorePricingProvider {...context}>{children}</OrxCorePricingProvider>
  );
