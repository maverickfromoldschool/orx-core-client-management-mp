// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {useAttributeFieldDialog} from './use-attribute-field-dialog';

describe('useAttributeFieldDialog', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useAttributeFieldDialog());

    expect(result.current).toBeTruthy();
    expect(result.current.onClick).toBeTruthy();
    expect(result.current.value).toBe('test value');
  });

  it('should change value on Click', async () => {
    const {result} = renderHook(() => useAttributeFieldDialog());

    // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
    await act(() => {
      result.current.onClick();
    });

    expect(result.current.value).toBe('new value');
  });
});
