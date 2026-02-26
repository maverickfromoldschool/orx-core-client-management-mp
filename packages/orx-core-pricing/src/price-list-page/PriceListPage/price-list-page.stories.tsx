import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import PriceListPageComponent from './price-list-page';
import {PriceListPageProps} from './price-list-page.types';

export default {
  component: PriceListPageComponent,
  title: 'PriceListPage'
} as Meta<typeof PriceListPageComponent>;

const Template: StoryFn<typeof PriceListPageComponent> = (args) => <PriceListPageComponent {...args} />;

export const PriceListPage = Template.bind({});
const props: PriceListPageProps = {
  text: 'PriceListPage Component'
};
PriceListPage.args = props;
