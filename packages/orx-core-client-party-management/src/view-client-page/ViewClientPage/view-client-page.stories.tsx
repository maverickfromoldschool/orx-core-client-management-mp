import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import ViewClientPageComponent from './view-client-page';
import {ViewClientPageProps} from './view-client-page.types';

export default {
  component: ViewClientPageComponent,
  title: 'ViewClientPage'
} as Meta<typeof ViewClientPageComponent>;

const Template: StoryFn<typeof ViewClientPageComponent> = (args) => <ViewClientPageComponent {...args} />;

export const ViewClientPage = Template.bind({});
const props: ViewClientPageProps = {
  text: 'ViewClientPage Component'
};
ViewClientPage.args = props;
