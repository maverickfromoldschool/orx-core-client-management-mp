// eslint-disable-next-line import/no-extraneous-dependencies
import {action} from '@storybook/addon-actions';
import React from 'react';

import {OrxCoreClientManagementContextProps} from './orx-core-client-management-provider.types';
import {OrxCoreClientManagementProvider} from './orx-core-client-management-provider';

export const defaultContext: OrxCoreClientManagementContextProps = {
  onClickLink: action('onClickLink')
};

export const WithOrxCoreClientManagementContext = ({
  children,
  context = defaultContext
}: {
  children: React.ReactNode;
  context?: OrxCoreClientManagementContextProps;
}) => <OrxCoreClientManagementProvider {...context}>{children}</OrxCoreClientManagementProvider>;
