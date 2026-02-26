import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useOrxCoreProducts} from './use-orx-core-products';
import type {UseOrxCoreProductsProps} from './use-orx-core-products.types';

describe('useOrxCoreProducts', () => {
  it('should return expected value', () => {
    const ref = React.createRef<HTMLDivElement>();
    const props: UseOrxCoreProductsProps = {
      ref
    };
    const {result} = renderHook(() => useOrxCoreProducts(props));

    expect(result.current).toBeTruthy();
  });
});
