import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import PriceListEntryDetailsPageComponent from './price-list-entry-details-page';
import {PriceListEntryDetailsPageProps} from './price-list-entry-details-page.types';

export default {
  component: PriceListEntryDetailsPageComponent,
  title: 'PriceListEntryDetailsPage'
} as Meta<typeof PriceListEntryDetailsPageComponent>;

const Template: StoryFn<typeof PriceListEntryDetailsPageComponent> = (args) => (
  <PriceListEntryDetailsPageComponent {...args} />
);

export const PriceListEntryDetailsPage = Template.bind({});
const props: PriceListEntryDetailsPageProps = {
  text: 'PriceListEntryDetailsPage Component'
};
PriceListEntryDetailsPage.args = props;
