import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useOrxCorePricing} from './use-orx-core-pricing';
import type {UseOrxCorePricingProps} from './use-orx-core-pricing.types';

describe('useOrxCorePricing', () => {
  it('should return expected value', () => {
    const ref = React.createRef<HTMLDivElement>();
    const props: UseOrxCorePricingProps = {
      ref
    };
    const {result} = renderHook(() => useOrxCorePricing(props));

    expect(result.current).toBeTruthy();
  });
});
