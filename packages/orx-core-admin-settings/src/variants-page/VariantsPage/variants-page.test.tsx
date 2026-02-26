import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {VariantsPage} from './variants-page';

describe('VariantsPage', () => {
  it('should render successfully', () => {
    const {baseElement} = render(
      <NotificationProvider>
        <VariantsPage />
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
