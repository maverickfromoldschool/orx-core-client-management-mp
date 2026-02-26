import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import AddClientPageComponent, {AddClientPageProps} from './add-client-page';

export default {
  component: AddClientPageComponent,
  title: 'AddClientPage'
} as Meta<typeof AddClientPageComponent>;

const Template: StoryFn<AddClientPageProps> = (args) => <AddClientPageComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
  clientsListUrl: '/clients'
};
