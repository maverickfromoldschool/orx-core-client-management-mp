// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {useLookupExtensionDialog} from './use-lookup-extension-dialog';

describe('useLookupExtensionDialog', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useLookupExtensionDialog({text: 'test text'}));

    expect(result.current).toBeTruthy();
    expect(result.current.onClick).toBeTruthy();
    expect(result.current.value).toBe('test text');
  });

  it('should change value on Click', () => {
    const {result} = renderHook(() => useLookupExtensionDialog({text: 'test text'}));

    act(() => {
      result.current.onClick();
    });

    expect(result.current.value).toBe('new value');
  });
});
