import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {PriceListPage} from './price-list-page';
import {PriceListPageProps} from './price-list-page.types';

describe('PriceListPage', () => {
  it('should render successfully', () => {
    const props: PriceListPageProps = {
      text: 'test text'
    };
    const {baseElement} = render(<PriceListPage {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
