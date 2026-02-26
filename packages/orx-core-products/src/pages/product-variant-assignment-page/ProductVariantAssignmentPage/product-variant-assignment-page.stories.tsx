import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import ProductVariantAssignmentPageComponent from './product-variant-assignment-page';
import {ProductVariantAssignmentPageProps} from './product-variant-assignment-page.types';

export default {
  component: ProductVariantAssignmentPageComponent,
  title: 'ProductVariantAssignmentPage'
} as Meta<typeof ProductVariantAssignmentPageComponent>;

const Template: StoryFn<typeof ProductVariantAssignmentPageComponent> = (args) => (
  <ProductVariantAssignmentPageComponent {...args} />
);

export const ProductVariantAssignmentPage = Template.bind({});
const props: ProductVariantAssignmentPageProps = {
  text: 'ProductVariantAssignmentPage Component'
};
ProductVariantAssignmentPage.args = props;
