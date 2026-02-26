import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
// eslint-disable-next-line import/no-unresolved
import {withActions} from '@storybook/addon-actions/decorator';

import OrxCoreFileCenterComponent from './orx-core-file-center';
import {OrxCoreFileCenterProps} from './orx-core-file-center.types';

export default {
  component: OrxCoreFileCenterComponent,
  title: 'OrxCoreFileCenter',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['event']
    }
  }
} as Meta<typeof OrxCoreFileCenterComponent>;

const Template: StoryFn<typeof OrxCoreFileCenterComponent> = (args) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    // Save a reference to the node
    ref.current = node;
  }, []);

  return <OrxCoreFileCenterComponent {...args} setRef={setRef} />;
};

export const OrxCoreFileCenter = Template.bind({});
const props: Partial<OrxCoreFileCenterProps> = {
  text: 'OrxCoreFileCenter Micro-product'
};
OrxCoreFileCenter.args = props;
