import React from 'react';

import {UseOrxCoreClientManagementReturn} from '../../orx-core-client-management/useOrxCoreClientManagement/use-orx-core-client-management.types';

export interface OrxCoreClientManagementProviderProps extends OrxCoreClientManagementContextProps {
  children: React.ReactNode;
}

// the context props should be the same as the props for the top level micro-product
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrxCoreClientManagementContextProps extends UseOrxCoreClientManagementReturn {}
