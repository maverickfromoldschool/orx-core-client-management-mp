import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, renderHook} from '@testing-library/react';

import {OrxCoreProductsProvider, useOrxCoreProductsContext} from './orx-core-products-provider';
import {OrxCoreProductsProviderProps} from './orx-core-products-provider.types';
import {WithMockOrxCoreProductsContext, mockContext} from './orx-core-products-provider.mock';

describe('OrxCoreProducts', () => {
  it('should render successfully', () => {
    const props: OrxCoreProductsProviderProps = {
      children: <div>test</div>,
      onClickLink: jest.fn()
    };
    const {baseElement} = render(<OrxCoreProductsProvider {...props} />);
    expect(baseElement).toBeTruthy();
  });
});

describe('useOrxCoreProductsContext', () => {
  it('should return the context', () => {
    const {result} = renderHook(() => useOrxCoreProductsContext(), {wrapper: WithMockOrxCoreProductsContext});
    expect(result.current).toStrictEqual(mockContext);
  });
});
