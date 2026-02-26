import {renderHook} from '@testing-library/react';

import {useOrxCoreAdminSettings} from './use-orx-core-admin-settings';

describe('useOrxCoreAdminSettings', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useOrxCoreAdminSettings());

    expect(result.current).toBeTruthy();
    expect(typeof result.current).toBe('object');
  });

  it('should return an object', () => {
    const {result} = renderHook(() => useOrxCoreAdminSettings());

    expect(typeof result.current).toBe('object');
  });
});
