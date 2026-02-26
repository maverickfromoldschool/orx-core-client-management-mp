import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import ProductGroupDialogComponent from './product-group-dialog';
import {ProductGroupDialogProps} from './product-group-dialog.types';

export default {
  component: ProductGroupDialogComponent,
  title: 'ProductGroupDialog'
} as Meta<typeof ProductGroupDialogComponent>;

const Template: StoryFn<typeof ProductGroupDialogComponent> = (args) => <ProductGroupDialogComponent {...args} />;

export const ProductGroupDialog = Template.bind({});
const props: ProductGroupDialogProps = {
  text: 'ProductGroupDialog Component'
};
ProductGroupDialog.args = props;
