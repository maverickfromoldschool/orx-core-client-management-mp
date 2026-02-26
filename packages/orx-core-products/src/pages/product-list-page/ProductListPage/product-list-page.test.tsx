import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import {NotificationProvider} from '@optum-rx-core/orx-core-notification';

import {ProductListPage} from './product-list-page';
import {ProductListPageProps} from './product-list-page.types';

describe('ProductListPage', () => {
  it('should render successfully', () => {
    const props: ProductListPageProps = {
      text: 'test text'
    };
    const {baseElement} = render(
      <NotificationProvider>
        <BrowserRouter>
          <ProductListPage {...props} />
        </BrowserRouter>
      </NotificationProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
