import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import ProductGroupComponent from './product-group';
import {ProductGroupProps} from './product-group.types';

export default {
  component: ProductGroupComponent,
  title: 'ProductGroup'
} as Meta<typeof ProductGroupComponent>;

const Template: StoryFn<typeof ProductGroupComponent> = (args) => <ProductGroupComponent {...args} />;

export const ProductGroup = Template.bind({});
const props: ProductGroupProps = {
  text: 'ProductGroup Component'
};
ProductGroup.args = props;
