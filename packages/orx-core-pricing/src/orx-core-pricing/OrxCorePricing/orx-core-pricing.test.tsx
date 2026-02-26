import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render} from '@testing-library/react';

import {OrxCorePricing} from './orx-core-pricing';
import {OrxCorePricingProps} from './orx-core-pricing.types';

describe('OrxCorePricing', () => {
  it('should render successfully', () => {
    const props: OrxCorePricingProps = {
      setRef: jest.fn(),
      text: 'test text'
    };
    const {baseElement} = render(<OrxCorePricing {...props} />);
    expect(baseElement).toBeTruthy();
  });
});
