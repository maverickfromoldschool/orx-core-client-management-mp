import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import ManageCagsComponent from './manage-cags';
import {ManageCagsProps} from './manage-cags.types';

export default {
  component: ManageCagsComponent,
  title: 'ManageCags'
} as Meta<typeof ManageCagsComponent>;

const Template: StoryFn<typeof ManageCagsComponent> = (args) => <ManageCagsComponent {...args} />;

export const ManageCags = Template.bind({});
const props: ManageCagsProps = {
  text: 'ManageCags Component'
};
ManageCags.args = props;
