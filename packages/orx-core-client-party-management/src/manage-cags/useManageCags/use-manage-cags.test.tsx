// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useManageCags} from './use-manage-cags';

describe('useManageCags', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useManageCags());

    expect(result.current).toBeTruthy();
  });
});
