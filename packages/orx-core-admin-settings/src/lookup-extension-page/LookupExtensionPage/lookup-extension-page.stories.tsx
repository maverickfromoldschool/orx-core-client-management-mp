import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import LookupExtensionPageComponent from './lookup-extension-page';
import {LookupExtensionPageProps} from './lookup-extension-page.types';

export default {
  component: LookupExtensionPageComponent,
  title: 'LookupExtensionPage'
} as Meta<typeof LookupExtensionPageComponent>;

const Template: StoryFn<typeof LookupExtensionPageComponent> = (args) => <LookupExtensionPageComponent {...args} />;

export const LookupExtensionPage = Template.bind({});
const props: LookupExtensionPageProps = {
  text: 'LookupExtensionPage Component'
};
LookupExtensionPage.args = props;
