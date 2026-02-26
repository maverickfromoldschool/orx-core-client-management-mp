// eslint-disable-next-line import/no-extraneous-dependencies
import {action} from '@storybook/addon-actions';
import React from 'react';

import {OrxCoreProductsContextProps} from './orx-core-products-provider.types';
import {OrxCoreProductsProvider} from './orx-core-products-provider';

export const defaultContext: OrxCoreProductsContextProps = {
  onClickLink: action('onClickLink')
};

export const WithOrxCoreProductsContext = ({
  children,
  context = defaultContext
}: {
  children: React.ReactNode;
  context?: OrxCoreProductsContextProps;
}) => <OrxCoreProductsProvider {...context}>{children}</OrxCoreProductsProvider>;
