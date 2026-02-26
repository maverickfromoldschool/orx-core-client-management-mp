import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import type {StoryFn, Meta} from '@storybook/react';

// eslint-disable-next-line import/no-named-as-default
import AttributeFieldDialogComponent from './attribute-field-dialog';
import {AttributeFieldDialogProps} from './attribute-field-dialog.types';

export default {
  component: AttributeFieldDialogComponent,
  title: 'AttributeFieldDialog'
} as Meta<typeof AttributeFieldDialogComponent>;

const Template: StoryFn<typeof AttributeFieldDialogComponent> = (args) => <AttributeFieldDialogComponent {...args} />;

export const AttributeFieldDialog = Template.bind({});
const props: AttributeFieldDialogProps = {
  text: 'AttributeFieldDialog Component'
};
AttributeFieldDialog.args = props;
