import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {PriceListEntryDetailsPage} from './price-list-entry-details-page';
import {PriceListEntryDetailsPageProps} from './price-list-entry-details-page.types';

describe('PriceListEntryDetailsPage', () => {
  it('should render successfully', () => {
    const props: PriceListEntryDetailsPageProps = {
      text: 'test text'
    };
    const {baseElement} = render(<PriceListEntryDetailsPage {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
