// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {useFileUploadDialog} from './use-file-upload-dialog';

describe('useFileUploadDialog', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useFileUploadDialog({text: 'test text'}));

    expect(result.current).toBeTruthy();
    expect(result.current.onClick).toBeTruthy();
    expect(result.current.value).toBe('test text');
  });

  it('should change value on Click', async () => {
    const {result} = renderHook(() => useFileUploadDialog({text: 'test text'}));

    await act(() => {
      result.current.onClick();
    });

    expect(result.current.value).toBe('new value');
  });
});
