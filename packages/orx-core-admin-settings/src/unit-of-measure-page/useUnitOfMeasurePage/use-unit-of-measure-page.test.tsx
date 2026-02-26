// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useUnitOfMeasurePage} from './use-unit-of-measure-page';

describe('useUnitOfMeasurePage', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useUnitOfMeasurePage());

    expect(result.current).toBeTruthy();
  });
});
