import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import LookupExtensionDialogComponent from './lookup-extension-dialog';
import {LookupExtensionDialogProps} from './lookup-extension-dialog.types';

export default {
  component: LookupExtensionDialogComponent,
  title: 'LookupExtensionDialog'
} as Meta<typeof LookupExtensionDialogComponent>;

const Template: StoryFn<typeof LookupExtensionDialogComponent> = (args) => <LookupExtensionDialogComponent {...args} />;

export const LookupExtensionDialog = Template.bind({});
const props: LookupExtensionDialogProps = {
  text: 'LookupExtensionDialog Component'
};
LookupExtensionDialog.args = props;
