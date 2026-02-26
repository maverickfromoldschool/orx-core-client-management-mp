// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {usePriceListEntryDetailsPage} from './use-price-list-entry-details-page';

describe('usePriceListEntryDetailsPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => usePriceListEntryDetailsPage());

    expect(result.current).toBeTruthy();
  });
});
