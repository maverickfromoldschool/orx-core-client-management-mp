// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {usePriceListDetailsPage} from './use-price-list-details-page';

describe('usePriceListDetailsPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => usePriceListDetailsPage());

    expect(result.current).toBeTruthy();
  });
});
