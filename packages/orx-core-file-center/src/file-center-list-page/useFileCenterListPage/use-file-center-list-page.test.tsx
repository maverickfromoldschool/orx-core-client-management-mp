// eslint-disable-next-line import/no-extraneous-dependencies
import {renderHook, waitFor} from '@testing-library/react';
import axios from 'axios';

import {useFileCenterListPage} from './use-file-center-list-page';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useFileCenterListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return expected initial values', async () => {
    mockedAxios.get.mockResolvedValueOnce({data: {uploadHistory: [], count: 0}});

    const {result} = renderHook(() => useFileCenterListPage());

    expect(result.current).toBeTruthy();
    expect(result.current.fetchFiles).toBeInstanceOf(Function);
    expect(result.current.refreshFiles).toBeInstanceOf(Function);

    // Wait for initial fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.files).toEqual([]);
      expect(result.current.error).toBeNull();
      expect(result.current.totalCount).toBe(0);
    });
  });

  it('should fetch files on mount', async () => {
    const mockData = {
      uploadHistory: [{uploadHistoryId: '1', fileName: 'test.txt'}],
      count: 1
    };
    mockedAxios.get.mockResolvedValueOnce({data: mockData});

    const {result} = renderHook(() => useFileCenterListPage());

    await waitFor(() => {
      expect(result.current.files).toHaveLength(1);
      expect(result.current.totalCount).toBe(1);
      expect(result.current.loading).toBe(false);
    });
  });

  it('should handle fetch errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    const {result} = renderHook(() => useFileCenterListPage());

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
      expect(result.current.loading).toBe(false);
    });
  });
});
