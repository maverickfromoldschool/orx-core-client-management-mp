// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook, waitFor} from '@testing-library/react';

import {useProductGroup} from './use-product-group';

jest.mock('axios');

describe('useProductGroup', () => {
  it('should return expected values', async () => {
    const {result} = renderHook(() => useProductGroup());

    await waitFor(() => {
      expect(result.current).toBeTruthy();
      expect(result.current.data).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
      expect(result.current.totalElements).toBeDefined();
      expect(result.current.handleSave).toBeDefined();
      expect(result.current.handleDelete).toBeDefined();
      expect(result.current.loadProductGroups).toBeDefined();
    });
  });
});
