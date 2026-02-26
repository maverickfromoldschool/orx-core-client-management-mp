import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {UnitOfMeasurePage} from './unit-of-measure-page';

describe('UnitOfMeasurePage', () => {
  it('should render successfully', () => {
    const {baseElement} = render(
      <NotificationProvider>
        <UnitOfMeasurePage />
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
