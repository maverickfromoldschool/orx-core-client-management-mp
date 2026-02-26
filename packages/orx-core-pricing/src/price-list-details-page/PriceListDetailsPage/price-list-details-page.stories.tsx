import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import PriceListDetailsPageComponent from './price-list-details-page';
import {PriceListDetailsPageProps} from './price-list-details-page.types';

export default {
  component: PriceListDetailsPageComponent,
  title: 'PriceListDetailsPage'
} as Meta<typeof PriceListDetailsPageComponent>;

const Template: StoryFn<typeof PriceListDetailsPageComponent> = (args) => <PriceListDetailsPageComponent {...args} />;

export const PriceListDetailsPage = Template.bind({});
const props: PriceListDetailsPageProps = {
  text: 'PriceListDetailsPage Component'
};
PriceListDetailsPage.args = props;
