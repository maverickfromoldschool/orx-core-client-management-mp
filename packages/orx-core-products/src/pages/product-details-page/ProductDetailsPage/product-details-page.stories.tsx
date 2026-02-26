import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import ProductDetailsPageComponent from './product-details-page';
import {ProductDetailsPageProps} from './product-details-page.types';

export default {
  component: ProductDetailsPageComponent,
  title: 'ProductDetailsPage'
} as Meta<typeof ProductDetailsPageComponent>;

const Template: StoryFn<typeof ProductDetailsPageComponent> = (args) => <ProductDetailsPageComponent {...args} />;

export const ProductDetailsPage = Template.bind({});
const props: ProductDetailsPageProps = {
  text: 'ProductDetailsPage Component'
};
ProductDetailsPage.args = props;
