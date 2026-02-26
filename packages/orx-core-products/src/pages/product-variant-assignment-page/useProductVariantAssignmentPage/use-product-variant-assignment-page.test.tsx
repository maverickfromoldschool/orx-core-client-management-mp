// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useProductVariantAssignmentPage} from './use-product-variant-assignment-page';

describe('useProductVariantAssignmentPage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useProductVariantAssignmentPage());

    expect(result.current).toBeTruthy();
  });
});
