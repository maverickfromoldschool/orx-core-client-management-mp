'use client';

// This file is meant to be used to take the props from the top level component and make them available
// to the rest of the components in the tree. This is done by using the React Context API.

// You shouldn't need to make any changes to this file or the corresponding tests as their job
// is EXCLUSIVELY to pass the props down to the rest of the components in the tree - not to add any new functionality.

// If you need to add more functionality to the micro-product then you should add it to the top level hook.

import React, {createContext, useContext} from 'react';

import {OrxCorePricingProviderProps, OrxCorePricingContextProps} from './orx-core-pricing-provider.types';

export const OrxCorePricingContext = createContext<OrxCorePricingContextProps | undefined>(undefined);

export function OrxCorePricingProvider(props: OrxCorePricingProviderProps) {
  const {children, ...rest} = props;

  return <OrxCorePricingContext.Provider value={rest}>{children}</OrxCorePricingContext.Provider>;
}

// eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
export const useOrxCorePricingContext = () => useContext(OrxCorePricingContext) as OrxCorePricingContextProps;

export default OrxCorePricingProvider;
