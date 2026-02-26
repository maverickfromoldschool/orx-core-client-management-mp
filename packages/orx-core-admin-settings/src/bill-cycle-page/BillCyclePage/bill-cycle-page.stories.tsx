import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import BillCyclePageComponent from './bill-cycle-page';
import {BillCyclePageProps} from './bill-cycle-page.types';

export default {
  component: BillCyclePageComponent,
  title: 'BillCyclePage'
} as Meta<typeof BillCyclePageComponent>;

const Template: StoryFn<typeof BillCyclePageComponent> = (args) => <BillCyclePageComponent {...args} />;

export const BillCyclePage = Template.bind({});
const props: BillCyclePageProps = {
  text: 'BillCyclePage Component'
};
BillCyclePage.args = props;
