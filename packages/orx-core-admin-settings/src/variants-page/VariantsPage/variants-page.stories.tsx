import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import VariantsPageComponent from './variants-page';
import {VariantsPageProps} from './variants-page.types';

export default {
  component: VariantsPageComponent,
  title: 'VariantsPage'
} as Meta<typeof VariantsPageComponent>;

const Template: StoryFn<typeof VariantsPageComponent> = (args) => <VariantsPageComponent {...args} />;

export const VariantsPage = Template.bind({});
const props: VariantsPageProps = {
  text: 'VariantsPage Component'
};
VariantsPage.args = props;
