'use client';

import {useState, useEffect, useCallback} from 'react';
import axios from 'axios';

import {FileRecord} from '../FileCenterListPage/file-center-list-page.types';

import {UseFileCenterListPageReturn} from './use-file-center-list-page.types';

const API_BASE_URL = 'https://coreweb-dev-api.optum.com';

interface ApiResponse {
  uploadHistory: FileRecord[];
  count: number;
}

export function useFileCenterListPage(): UseFileCenterListPageReturn {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [currentPageSize, setCurrentPageSize] = useState<number>(5);

  const fetchFiles = useCallback(
    async (page?: number, size?: number, filters?: Record<string, string | null>): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const params: Record<string, any> = {
          size: size ?? 5,
          page: page ?? 0
        };

        // Add filters if provided
        if (filters) {
          Object.keys(filters).forEach((key) => {
            if (filters[key] !== null && filters[key] !== '' && filters[key] !== 'all') {
              // Use 'search' parameter for global search instead of 'fileName'
              if (key === 'fileName') {
                params['search'] = filters[key];
              } else if (key === 'fileType') {
                const fileTypeValue = filters[key] === 'pricelist' ? 'pricing' : filters[key];
                params['fileType'] = fileTypeValue;
              } else {
                params[key] = filters[key];
              }
            }
          });
        }

        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/api/client/bulkUpload/uploadHistories`, {
          params
        });

        const {uploadHistory} = response.data;
        const {count} = response.data;

        setFiles(uploadHistory);
        setTotalCount(count);
        setCurrentPage(page ?? 0);
        setCurrentPageSize(size ?? 5);
      } catch (err: unknown) {
        let errorMessage = 'Failed to fetch upload histories';
        if (axios.isAxiosError(err)) {
          const data = err.response?.data as {message?: string} | undefined;
          errorMessage = data?.message ?? err.message;
        }
        setError(errorMessage);
        // eslint-disable-next-line no-console
        console.error('Error fetching upload histories:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refreshFiles = useCallback(async () => {
    await fetchFiles(currentPage, currentPageSize);
  }, [currentPage, currentPageSize, fetchFiles]);

  // Fetch files on initial mount
  useEffect(() => {
    fetchFiles(0, 5).catch((err: unknown) => {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch files on mount:', err);
    });
  }, [fetchFiles]);

  return {
    files,
    loading,
    error,
    totalCount,
    fetchFiles,
    refreshFiles
  };
}

export default useFileCenterListPage;
