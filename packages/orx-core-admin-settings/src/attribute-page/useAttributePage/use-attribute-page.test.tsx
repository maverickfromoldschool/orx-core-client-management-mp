// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {useAttributePage} from './use-attribute-page';

describe('useAttributePage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useAttributePage());

    expect(result.current).toBeTruthy();
    expect(result.current.onClick).toBeTruthy();
    expect(result.current.value).toBe('test value');
  });

  it('should change value on Click', async () => {
    const {result} = renderHook(() => useAttributePage());

    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
    await act(() => {
      result.current.onClick();
    });

    expect(result.current.value).toBe('new value');
  });
});
