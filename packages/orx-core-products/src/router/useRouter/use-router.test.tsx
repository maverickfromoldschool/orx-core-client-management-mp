// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {WithRouterContext} from '../Router/router.stories.wrapper';

import {useRouter} from './use-router';

describe('useRouter', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useRouter(), {wrapper: WithRouterContext});

    expect(result.current).toBeTruthy();
  });
});
