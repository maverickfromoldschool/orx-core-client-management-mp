import React from 'react';

import {OrxCoreFileCenterContextProps} from './orx-core-file-center-provider.types';
import {OrxCoreFileCenterProvider} from './orx-core-file-center-provider';

export const mockContext: OrxCoreFileCenterContextProps = {
  onClickLink: jest.fn()
};

export const WithMockOrxCoreFileCenterContext = ({
  children,
  context = mockContext
}: {
  children: React.ReactNode;
  context?: OrxCoreFileCenterContextProps;
}) => <OrxCoreFileCenterProvider {...context}>{children}</OrxCoreFileCenterProvider>;

export const WithMockOrxCoreFileCenterCustomContext =
  (customContext: OrxCoreFileCenterContextProps) =>
  ({children, context = customContext}: {children: React.ReactNode; context?: OrxCoreFileCenterContextProps}) => (
    <OrxCoreFileCenterProvider {...context}>{children}</OrxCoreFileCenterProvider>
  );
