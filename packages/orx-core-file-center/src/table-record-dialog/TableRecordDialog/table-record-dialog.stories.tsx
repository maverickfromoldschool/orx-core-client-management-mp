import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

import TableRecordDialogComponent from './table-record-dialog';
import {TableRecordDialogProps} from './table-record-dialog.types';

export default {
  component: TableRecordDialogComponent,
  title: 'TableRecordDialog'
} as Meta<typeof TableRecordDialogComponent>;

const Template: StoryFn<typeof TableRecordDialogComponent> = (args) => <TableRecordDialogComponent {...args} />;

export const TableRecordDialog = Template.bind({});
const props: TableRecordDialogProps = {
  text: 'TableRecordDialog Component'
};
TableRecordDialog.args = props;
