import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {render, renderHook} from '@testing-library/react';

import {OrxCoreFileCenterProvider, useOrxCoreFileCenterContext} from './orx-core-file-center-provider';
import {OrxCoreFileCenterProviderProps} from './orx-core-file-center-provider.types';
import {WithMockOrxCoreFileCenterContext, mockContext} from './orx-core-file-center-provider.mock';

describe('OrxCoreFileCenter', () => {
  it('should render successfully', () => {
    const props: OrxCoreFileCenterProviderProps = {
      children: <div>test</div>,
      onClickLink: jest.fn()
    };
    const {baseElement} = render(<OrxCoreFileCenterProvider {...props} />);
    expect(baseElement).toBeTruthy();
  });
});

describe('useOrxCoreFileCenterContext', () => {
  it('should return the context', () => {
    const {result} = renderHook(() => useOrxCoreFileCenterContext(), {wrapper: WithMockOrxCoreFileCenterContext});
    expect(result.current).toStrictEqual(mockContext);
  });
});
