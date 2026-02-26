// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useLookupPage} from './use-lookup-page';

describe('useLookupPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useLookupPage());

    expect(result.current).toBeTruthy();
  });
});
