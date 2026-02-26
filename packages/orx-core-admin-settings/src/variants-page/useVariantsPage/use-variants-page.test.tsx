// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useVariantsPage} from './use-variants-page';

describe('useVariantsPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useVariantsPage());

    expect(result.current).toBeTruthy();
  });
});
