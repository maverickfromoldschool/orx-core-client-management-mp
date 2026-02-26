// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';

import {useProductGroupDialog} from './use-product-group-dialog';

const mockProps = {
  open: true,
  mode: 'create' as const,
  onClose: jest.fn(),
  onSave: jest.fn(),
  productCategoryOptions: [],
  externalSystemOptions: [],
  accountingCodeOptions: [],
  attributeOptions: [],
  variantOptions: []
};

describe('useProductGroupDialog', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useProductGroupDialog({...mockProps, text: 'test text'}));

    expect(result.current).toBeTruthy();
    expect(result.current.onClick).toBeTruthy();
    expect(result.current.value).toBe('test text');
  });

  it('should change value on Click', () => {
    const {result} = renderHook(() => useProductGroupDialog({...mockProps, text: 'test text'}));

    act(() => {
      result.current.onClick();
    });

    expect(result.current.value).toBe('new value');
  });
});
