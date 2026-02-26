import React from 'react';

import {OrxCoreProductsContextProps} from './orx-core-products-provider.types';
import {OrxCoreProductsProvider} from './orx-core-products-provider';

export const mockContext: OrxCoreProductsContextProps = {
  onClickLink: jest.fn()
};

export const WithMockOrxCoreProductsContext = ({
  children,
  context = mockContext
}: {
  children: React.ReactNode;
  context?: OrxCoreProductsContextProps;
}) => <OrxCoreProductsProvider {...context}>{children}</OrxCoreProductsProvider>;

export const WithMockOrxCoreProductsCustomContext =
  (customContext: OrxCoreProductsContextProps) =>
  ({children, context = customContext}: {children: React.ReactNode; context?: OrxCoreProductsContextProps}) => (
    <OrxCoreProductsProvider {...context}>{children}</OrxCoreProductsProvider>
  );
