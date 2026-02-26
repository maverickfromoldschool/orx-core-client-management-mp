import React from 'react';

import {UseOrxCorePricingReturn} from '../../orx-core-pricing/useOrxCorePricing/use-orx-core-pricing.types';

export interface OrxCorePricingProviderProps extends OrxCorePricingContextProps {
  children: React.ReactNode;
}

// the context props should be the same as the props for the top level micro-product
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrxCorePricingContextProps extends UseOrxCorePricingReturn {}
