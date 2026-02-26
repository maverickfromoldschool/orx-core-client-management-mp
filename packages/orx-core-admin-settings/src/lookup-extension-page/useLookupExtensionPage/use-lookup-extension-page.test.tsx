// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {useLookupExtensionPage} from './use-lookup-extension-page';

describe('useLookupExtensionPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useLookupExtensionPage({text: 'test text'}));

    expect(result.current).toBeTruthy();
    expect(result.current.onClick).toBeTruthy();
    expect(result.current.value).toBe('test text');
  });

  it('should change value on Click', () => {
    const {result} = renderHook(() => useLookupExtensionPage({text: 'test text'}));

    act(() => {
      result.current.onClick();
    });

    expect(result.current.value).toBe('new value');
  });
});
