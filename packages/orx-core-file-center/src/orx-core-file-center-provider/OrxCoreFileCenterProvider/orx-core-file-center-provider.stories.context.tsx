// eslint-disable-next-line import/no-extraneous-dependencies
import {action} from '@storybook/addon-actions';
import React from 'react';

import {OrxCoreFileCenterContextProps} from './orx-core-file-center-provider.types';
import {OrxCoreFileCenterProvider} from './orx-core-file-center-provider';

export const defaultContext: OrxCoreFileCenterContextProps = {
  onClickLink: action('onClickLink')
};

export const WithOrxCoreFileCenterContext = ({
  children,
  context = defaultContext
}: {
  children: React.ReactNode;
  context?: OrxCoreFileCenterContextProps;
}) => <OrxCoreFileCenterProvider {...context}>{children}</OrxCoreFileCenterProvider>;
