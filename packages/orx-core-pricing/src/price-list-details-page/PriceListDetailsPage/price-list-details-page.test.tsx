import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {PriceListDetailsPage} from './price-list-details-page';
import {PriceListDetailsPageProps} from './price-list-details-page.types';

describe('PriceListDetailsPage', () => {
  it('should render successfully', () => {
    const props: PriceListDetailsPageProps = {
      text: 'test text'
    };
    const {baseElement} = render(<PriceListDetailsPage {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
