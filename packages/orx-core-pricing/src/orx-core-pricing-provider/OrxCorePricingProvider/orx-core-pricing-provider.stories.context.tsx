// eslint-disable-next-line import/no-extraneous-dependencies
import {action} from '@storybook/addon-actions';
import React from 'react';

import {OrxCorePricingContextProps} from './orx-core-pricing-provider.types';
import {OrxCorePricingProvider} from './orx-core-pricing-provider';

export const defaultContext: OrxCorePricingContextProps = {
  onClickLink: action('onClickLink')
};

export const WithOrxCorePricingContext = ({
  children,
  context = defaultContext
}: {
  children: React.ReactNode;
  context?: OrxCorePricingContextProps;
}) => <OrxCorePricingProvider {...context}>{children}</OrxCorePricingProvider>;
