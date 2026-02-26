import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useOrxCoreFileCenter} from './use-orx-core-file-center';
import type {UseOrxCoreFileCenterProps} from './use-orx-core-file-center.types';

describe('useOrxCoreFileCenter', () => {
  it('should return expected value', () => {
    const ref = React.createRef<HTMLDivElement>();
    const props: UseOrxCoreFileCenterProps = {
      ref
    };
    const {result} = renderHook(() => useOrxCoreFileCenter(props));

    expect(result.current).toBeTruthy();
  });
});
