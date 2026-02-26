import React from 'react';

import {UseOrxCoreFileCenterReturn} from '../../orx-core-file-center/useOrxCoreFileCenter/use-orx-core-file-center.types';

export interface OrxCoreFileCenterProviderProps extends OrxCoreFileCenterContextProps {
  children: React.ReactNode;
}

// the context props should be the same as the props for the top level micro-product
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrxCoreFileCenterContextProps extends UseOrxCoreFileCenterReturn {}
