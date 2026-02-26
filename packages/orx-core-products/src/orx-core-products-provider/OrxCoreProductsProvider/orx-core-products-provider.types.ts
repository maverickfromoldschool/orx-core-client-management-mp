import React from 'react';

import {UseOrxCoreProductsReturn} from '../../orx-core-products/useOrxCoreProducts/use-orx-core-products.types';

export interface OrxCoreProductsProviderProps extends OrxCoreProductsContextProps {
  children: React.ReactNode;
}

// the context props should be the same as the props for the top level micro-product
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrxCoreProductsContextProps extends UseOrxCoreProductsReturn {}
