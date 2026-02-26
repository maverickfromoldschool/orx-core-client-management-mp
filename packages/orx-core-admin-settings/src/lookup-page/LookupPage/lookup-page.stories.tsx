import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import LookupPageComponent from './lookup-page';
import {LookupPageProps} from './lookup-page.types';

export default {
  component: LookupPageComponent,
  title: 'LookupPage'
} as Meta<typeof LookupPageComponent>;

const Template: StoryFn<typeof LookupPageComponent> = (args) => <LookupPageComponent {...args} />;

export const LookupPage = Template.bind({});
const props: LookupPageProps = {
  text: 'LookupPage Component'
};
LookupPage.args = props;
