import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import FileCenterListPageComponent from './file-center-list-page';
import {FileCenterListPageProps} from './file-center-list-page.types';

export default {
  component: FileCenterListPageComponent,
  title: 'FileCenterListPage'
} as Meta<typeof FileCenterListPageComponent>;

const Template: StoryFn<typeof FileCenterListPageComponent> = (args) => <FileCenterListPageComponent {...args} />;

export const FileCenterListPage = Template.bind({});
const props: FileCenterListPageProps = {
  text: 'FileCenterListPage Component'
};
FileCenterListPage.args = props;
