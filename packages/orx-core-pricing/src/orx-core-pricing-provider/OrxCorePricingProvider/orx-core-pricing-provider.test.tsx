import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, renderHook} from '@testing-library/react';

import {OrxCorePricingProvider, useOrxCorePricingContext} from './orx-core-pricing-provider';
import {OrxCorePricingProviderProps} from './orx-core-pricing-provider.types';
import {WithMockOrxCorePricingContext, mockContext} from './orx-core-pricing-provider.mock';

describe('OrxCorePricing', () => {
  it('should render successfully', () => {
    const props: OrxCorePricingProviderProps = {
      children: <div>test</div>,
      onClickLink: jest.fn()
    };
    const {baseElement} = render(<OrxCorePricingProvider {...props} />);
    expect(baseElement).toBeTruthy();
  });
});

describe('useOrxCorePricingContext', () => {
  it('should return the context', () => {
    const {result} = renderHook(() => useOrxCorePricingContext(), {wrapper: WithMockOrxCorePricingContext});
    expect(result.current).toStrictEqual(mockContext);
  });
});
