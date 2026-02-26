import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
// eslint-disable-next-line import/no-unresolved
import {withActions} from '@storybook/addon-actions/decorator';

import OrxCorePricingComponent from './orx-core-pricing';
import {OrxCorePricingProps} from './orx-core-pricing.types';

export default {
  component: OrxCorePricingComponent,
  title: 'OrxCorePricing',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['event']
    }
  }
} as Meta<typeof OrxCorePricingComponent>;

const Template: StoryFn<typeof OrxCorePricingComponent> = (args) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    // Save a reference to the node
    ref.current = node;
  }, []);

  return <OrxCorePricingComponent {...args} setRef={setRef} />;
};

export const OrxCorePricing = Template.bind({});
const props: Partial<OrxCorePricingProps> = {
  text: 'OrxCorePricing Micro-product'
};
OrxCorePricing.args = props;
