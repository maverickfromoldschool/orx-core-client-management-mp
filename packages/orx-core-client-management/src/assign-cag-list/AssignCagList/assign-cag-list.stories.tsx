import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import AssignCagListComponent from './assign-cag-list';
import {AssignCagListProps} from './assign-cag-list.types';

export default {
  component: AssignCagListComponent,
  title: 'AssignCagList'
} as Meta<typeof AssignCagListComponent>;

const Template: StoryFn<typeof AssignCagListComponent> = (args) => <AssignCagListComponent {...args} />;

export const AssignCagList = Template.bind({});
const props: AssignCagListProps = {
  text: 'AssignCagList Component'
};
AssignCagList.args = props;
