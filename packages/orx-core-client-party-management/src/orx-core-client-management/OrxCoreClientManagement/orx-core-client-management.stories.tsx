import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {StoryFn, Meta} from '@storybook/react';
// eslint-disable-next-line import/no-unresolved
import {withActions} from '@storybook/addon-actions/decorator';

import OrxCoreClientManagementComponent from './orx-core-client-management';
import {OrxCoreClientManagementProps} from './orx-core-client-management.types';

// mock any API calls using the msw-storybook-addon: https://storybook.js.org/addons/msw-storybook-addon
// eslint-disable-next-line import/no-extraneous-dependencies
// import {http, HttpResponse} from 'msw';
// const apiMocks = {
//   msw: {
//     handlers: [
//       http.get('/path/to/my/endpoint', () => {
//         return HttpResponse.json({
//           hello: 'world'
//         })
//       })
//     ]
//   }
// };

export default {
  component: OrxCoreClientManagementComponent,
  title: 'OrxCoreClientManagement',
  decorators: [withActions],
  parameters: {
    actions: {
      handles: ['event']
    }
    // ...apiMocks
  }
} as Meta<typeof OrxCoreClientManagementComponent>;

const Template: StoryFn<typeof OrxCoreClientManagementComponent> = (args) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const setRef = React.useCallback((node: HTMLDivElement | null) => {
    // Save a reference to the node
    ref.current = node;
  }, []);

  return <OrxCoreClientManagementComponent {...args} setRef={setRef} />;
};

export const OrxCoreClientManagement = Template.bind({});
const props: Partial<OrxCoreClientManagementProps> = {
  text: 'OrxCoreClientManagement Micro-product'
};
OrxCoreClientManagement.args = props;
