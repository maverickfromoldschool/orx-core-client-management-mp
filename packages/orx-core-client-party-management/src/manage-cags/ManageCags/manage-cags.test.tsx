import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {WithRouterContext} from '../../router/Router/router.stories.wrapper';

import {ManageCagsPage} from './manage-cags';
import {ManageCagsProps} from './manage-cags.types';

describe('ManageCags', () => {
  it('should render successfully', () => {
    const props: ManageCagsProps = {
      text: 'test text'
    };
    const {baseElement} = render(
      <NotificationProvider>
        <WithRouterContext>
          <ManageCagsPage {...props} />
        </WithRouterContext>
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
