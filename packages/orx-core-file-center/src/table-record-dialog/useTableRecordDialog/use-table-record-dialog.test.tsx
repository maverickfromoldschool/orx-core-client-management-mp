// eslint-disable-next-line import/no-extraneous-dependencies
import {act, renderHook} from '@testing-library/react';
import axios from 'axios';

import {useTableRecordDialog} from './use-table-record-dialog';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useTableRecordDialog', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // default axios.get mock to return a small list so the hook loads rows during tests
    mockedAxios.get.mockResolvedValue({data: [{id: 'mock-1', message: 'mock message 1'}]} as any);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns rows, loading, error and refresh', async () => {
    const {result} = renderHook(() => useTableRecordDialog({fileRecord: {uploadHistoryId: 'test-1'}} as any));

    expect(result.current).toBeTruthy();
    expect(result.current).toEqual(
      expect.objectContaining({
        rows: expect.any(Array),
        loading: expect.any(Boolean),
        refresh: expect.any(Function)
      })
    );

    // advance the fake timers so the mock fetch resolves
    await act(async () => {
      jest.advanceTimersByTime(500);
      // allow pending microtasks to run
      await Promise.resolve();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.rows.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('refresh reloads rows', async () => {
    const {result} = renderHook(() => useTableRecordDialog({fileRecord: {uploadHistoryId: 'test-1'}} as any));

    // allow initial load
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // call refresh and wait for it to finish
    await act(async () => {
      const p = result.current.refresh();
      jest.advanceTimersByTime(500);
      await p;
    });

    expect(result.current.rows.length).toBeGreaterThan(0);
    expect(result.current.loading).toBe(false);
  });
});
