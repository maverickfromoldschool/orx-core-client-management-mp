import React from 'react';
import {renderHook} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';

import {useRouter} from './use-router';

const WithRouterContext = ({children}: {children: React.ReactNode}) => <BrowserRouter>{children}</BrowserRouter>;

describe('useRouter', () => {
  it('should return expected value', () => {
    const {result} = renderHook(() => useRouter(), {wrapper: WithRouterContext});

    expect(result.current).toBeTruthy();
    expect(result.current.params).toBeDefined();
    expect(result.current.navigate).toBeDefined();
    expect(result.current.searchParams).toBeDefined();
    expect(result.current.setSearchParams).toBeDefined();
  });

  it('should return params object', () => {
    const {result} = renderHook(() => useRouter(), {wrapper: WithRouterContext});

    expect(typeof result.current.params).toBe('object');
  });

  it('should return navigate function', () => {
    const {result} = renderHook(() => useRouter(), {wrapper: WithRouterContext});

    expect(typeof result.current.navigate).toBe('function');
  });

  it('should return searchParams', () => {
    const {result} = renderHook(() => useRouter(), {wrapper: WithRouterContext});

    expect(result.current.searchParams).toBeDefined();
  });

  it('should return setSearchParams function', () => {
    const {result} = renderHook(() => useRouter(), {wrapper: WithRouterContext});

    expect(typeof result.current.setSearchParams).toBe('function');
  });
});
