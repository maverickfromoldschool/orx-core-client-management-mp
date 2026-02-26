'use client';

// This file is meant to be used to take the props from the top level component and make them available
// to the rest of the components in the tree. This is done by using the React Context API.

// You shouldn't need to make any changes to this file or the corresponding tests as their job
// is EXCLUSIVELY to pass the props down to the rest of the components in the tree - not to add any new functionality.

// If you need to add more functionality to the micro-product then you should add it to the top level hook.

import React, {createContext, useContext} from 'react';

import {
  OrxCoreClientManagementProviderProps,
  OrxCoreClientManagementContextProps
} from './orx-core-client-management-provider.types';

export const OrxCoreClientManagementContext = createContext<OrxCoreClientManagementContextProps | undefined>(undefined);

export function OrxCoreClientManagementProvider(props: OrxCoreClientManagementProviderProps) {
  const {children, ...rest} = props;

  return <OrxCoreClientManagementContext.Provider value={rest}>{children}</OrxCoreClientManagementContext.Provider>;
}

export const useOrxCoreClientManagementContext = () => {
  const context = useContext(OrxCoreClientManagementContext);

  if (!context) {
    throw new Error('useOrxCoreClientManagementContext must be used within OrxCoreClientManagementProvider');
  }

  return context;
};

export default OrxCoreClientManagementProvider;
