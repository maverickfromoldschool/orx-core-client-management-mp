import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook} from '@testing-library/react';

import {useOrxCoreClientManagement} from './use-orx-core-client-management';
import type {UseOrxCoreClientManagementProps} from './use-orx-core-client-management.types';

describe('useOrxCoreClientManagement', () => {
  it('should return expected value', () => {
    const ref = React.createRef<HTMLDivElement>();
    const props: UseOrxCoreClientManagementProps = {
      ref
    };
    const {result} = renderHook(() => useOrxCoreClientManagement(props));

    expect(result.current).toBeTruthy();
  });
});
