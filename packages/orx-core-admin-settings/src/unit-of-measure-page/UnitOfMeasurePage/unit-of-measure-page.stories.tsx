import React from 'react';
import type {StoryFn, Meta} from '@storybook/react';

import UnitOfMeasurePageComponent from './unit-of-measure-page';
import {UnitOfMeasurePageProps} from './unit-of-measure-page.types';

export default {
  component: UnitOfMeasurePageComponent,
  title: 'UnitOfMeasurePage'
} as Meta<typeof UnitOfMeasurePageComponent>;

const Template: StoryFn<typeof UnitOfMeasurePageComponent> = (args) => <UnitOfMeasurePageComponent {...args} />;

export const UnitOfMeasurePage = Template.bind({});
const props: UnitOfMeasurePageProps = {
  text: 'UnitOfMeasurePage Component'
};
UnitOfMeasurePage.args = props;
