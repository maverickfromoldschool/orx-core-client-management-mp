import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {ProductViewPage} from './product-view-page';
import {ProductViewPageProps} from './product-view-page.types';

describe('ProductViewPage', () => {
  it('should render successfully', () => {
    const props: ProductViewPageProps = {
      text: 'test text'
    };
    const {baseElement} = render(
      <NotificationProvider>
        <ProductViewPage {...props} />
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
