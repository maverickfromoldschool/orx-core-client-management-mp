// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {usePriceListPage} from './use-price-list-page';

describe('usePriceListPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => usePriceListPage());

    expect(result.current).toBeTruthy();
  });
});
