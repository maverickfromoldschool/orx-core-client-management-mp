import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import FileCenterHomeComponent from './file-center-home';
import {FileCenterHomeProps} from './file-center-home.types';

export default {
  component: FileCenterHomeComponent,
  title: 'FileCenterHome'
} as Meta<typeof FileCenterHomeComponent>;

const Template: StoryFn<typeof FileCenterHomeComponent> = (args) => <FileCenterHomeComponent {...args} />;

export const FileCenterHome = Template.bind({});
const props: FileCenterHomeProps = {
  text: 'FileCenterHome Component'
};
FileCenterHome.args = props;
