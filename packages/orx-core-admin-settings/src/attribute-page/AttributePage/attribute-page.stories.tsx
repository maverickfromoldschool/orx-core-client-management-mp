import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import AttributePageComponent from './attribute-page';
import {AttributePageProps} from './attribute-page.types';

export default {
  component: AttributePageComponent,
  title: 'AttributePage'
} as Meta<typeof AttributePageComponent>;

const Template: StoryFn<typeof AttributePageComponent> = (args) => <AttributePageComponent {...args} />;

export const AttributePage = Template.bind({});
const props: AttributePageProps = {
  text: 'AttributePage Component'
};
AttributePage.args = props;
