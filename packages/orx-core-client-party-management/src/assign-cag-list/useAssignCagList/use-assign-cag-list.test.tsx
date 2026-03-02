// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {useAssignCagList} from './use-assign-cag-list';

describe('useAssignCagList', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useAssignCagList({text: 'test text'}));

    expect(result.current).toBeTruthy();
    expect(result.current.onClick).toBeTruthy();
    expect(result.current.value).toBe('test text');
  });

  it('should change value on Click', async () => {
    const {result} = renderHook(() => useAssignCagList({text: 'test text'}));

    await act(() => {
      result.current.onClick();
    });

    expect(result.current.value).toBe('new value');
  });
});
