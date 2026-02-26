// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useProductDetailsPage} from './use-product-details-page';

describe('useProductDetailsPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useProductDetailsPage());

    expect(result.current).toBeTruthy();
  });
});
