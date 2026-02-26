import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import ProductViewPageComponent from './product-view-page';
import {ProductViewPageProps} from './product-view-page.types';

export default {
  component: ProductViewPageComponent,
  title: 'ProductViewPage'
} as Meta<typeof ProductViewPageComponent>;

const Template: StoryFn<typeof ProductViewPageComponent> = (args) => <ProductViewPageComponent {...args} />;

export const ProductViewPage = Template.bind({});
const props: ProductViewPageProps = {
  text: 'ProductViewPage Component'
};
ProductViewPage.args = props;
