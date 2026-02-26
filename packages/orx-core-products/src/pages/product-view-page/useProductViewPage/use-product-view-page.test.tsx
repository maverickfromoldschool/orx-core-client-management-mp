// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useProductViewPage} from './use-product-view-page';

describe('useProductViewPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useProductViewPage());

    expect(result.current).toBeTruthy();
  });
});
