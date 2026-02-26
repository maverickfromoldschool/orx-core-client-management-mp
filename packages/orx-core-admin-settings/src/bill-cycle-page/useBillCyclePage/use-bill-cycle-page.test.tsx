// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useBillCyclePage} from './use-bill-cycle-page';

describe('useBillCyclePage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useBillCyclePage());

    expect(result.current).toBeTruthy();
  });
});
