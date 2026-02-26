import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import ProductListPageComponent from './product-list-page';
import {ProductListPageProps} from './product-list-page.types';

export default {
  component: ProductListPageComponent,
  title: 'ProductListPage'
} as Meta<typeof ProductListPageComponent>;

const Template: StoryFn<typeof ProductListPageComponent> = (args) => <ProductListPageComponent {...args} />;

export const ProductListPage = Template.bind({});
const props: ProductListPageProps = {
  text: 'ProductListPage Component'
};
ProductListPage.args = props;
