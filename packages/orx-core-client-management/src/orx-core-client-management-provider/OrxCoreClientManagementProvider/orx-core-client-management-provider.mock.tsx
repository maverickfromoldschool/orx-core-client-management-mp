import React from 'react';

import {OrxCoreClientManagementContextProps} from './orx-core-client-management-provider.types';
import {OrxCoreClientManagementProvider} from './orx-core-client-management-provider';

export const mockContext: OrxCoreClientManagementContextProps = {
  onClickLink: jest.fn()
};

export const WithMockOrxCoreClientManagementContext = ({
  children,
  context = mockContext
}: {
  children: React.ReactNode;
  context?: OrxCoreClientManagementContextProps;
}) => <OrxCoreClientManagementProvider {...context}>{children}</OrxCoreClientManagementProvider>;

export const WithMockOrxCoreClientManagementCustomContext =
  (customContext: OrxCoreClientManagementContextProps) =>
  ({children, context = customContext}: {children: React.ReactNode; context?: OrxCoreClientManagementContextProps}) => (
    <OrxCoreClientManagementProvider {...context}>{children}</OrxCoreClientManagementProvider>
  );
