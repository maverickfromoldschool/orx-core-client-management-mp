import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import ClientListPageComponent from './client-list-page';
import {ClientListPageProps} from './client-list-page.types';

export default {
  component: ClientListPageComponent,
  title: 'ClientListPage'
} as Meta<typeof ClientListPageComponent>;

const Template: StoryFn<typeof ClientListPageComponent> = (args) => <ClientListPageComponent {...args} />;

export const ClientListPage = Template.bind({});
const props: ClientListPageProps = {
  text: 'ClientListPage Component'
};
ClientListPage.args = props;
