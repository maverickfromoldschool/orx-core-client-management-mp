import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, renderHook} from '@testing-library/react';

import {
  OrxCoreClientManagementProvider,
  useOrxCoreClientManagementContext
} from './orx-core-client-management-provider';
import {OrxCoreClientManagementProviderProps} from './orx-core-client-management-provider.types';
import {WithMockOrxCoreClientManagementContext, mockContext} from './orx-core-client-management-provider.mock';

describe('OrxCoreClientManagement', () => {
  it('should render successfully', () => {
    const props: OrxCoreClientManagementProviderProps = {
      children: <div>test</div>,
      onClickLink: jest.fn()
    };
    const {baseElement} = render(<OrxCoreClientManagementProvider {...props} />);
    expect(baseElement).toBeTruthy();
  });
});

describe('useOrxCoreClientManagementContext', () => {
  it('should return the context', () => {
    const {result} = renderHook(() => useOrxCoreClientManagementContext(), {
      wrapper: WithMockOrxCoreClientManagementContext
    });
    expect(result.current).toStrictEqual(mockContext);
  });
});
