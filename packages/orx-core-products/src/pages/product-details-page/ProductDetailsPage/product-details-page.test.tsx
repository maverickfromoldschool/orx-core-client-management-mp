import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {ProductDetailsPage} from './product-details-page';
import {ProductDetailsPageProps} from './product-details-page.types';

describe('ProductDetailsPage', () => {
  it('should render successfully', () => {
    const props: ProductDetailsPageProps = {
      text: 'test text'
    };
    const {baseElement} = render(
      <NotificationProvider>
        <BrowserRouter>
          <ProductDetailsPage {...props} />
        </BrowserRouter>
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
