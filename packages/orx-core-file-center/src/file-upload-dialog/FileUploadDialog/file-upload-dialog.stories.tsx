import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import FileUploadDialogComponent from './file-upload-dialog';
import {FileUploadDialogProps} from './file-upload-dialog.types';

export default {
  component: FileUploadDialogComponent,
  title: 'FileUploadDialog'
} as Meta<typeof FileUploadDialogComponent>;

const Template: StoryFn<typeof FileUploadDialogComponent> = (args) => <FileUploadDialogComponent {...args} />;

export const FileUploadDialog = Template.bind({});
const props: FileUploadDialogProps = {
  text: 'FileUploadDialog Component'
};
FileUploadDialog.args = props;
