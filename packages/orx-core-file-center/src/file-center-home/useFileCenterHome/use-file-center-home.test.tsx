// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {useFileCenterHome} from './use-file-center-home';

describe('useFileCenterHome', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useFileCenterHome({title: 'test text'}));

    expect(result.current).toBeTruthy();
    expect(result.current.onClick).toBeTruthy();
    expect(result.current.value).toBe('test text');
  });

  it('should change value on Click', async () => {
    const {result} = renderHook(() => useFileCenterHome({title: 'test text'}));

    await act(() => {
      result.current.onClick();
    });

    expect(result.current.value).toBe('new value');
  });
});
