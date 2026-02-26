import {FileRecord} from '../FileCenterListPage/file-center-list-page.types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseFileCenterListPageProps {}

/**
 * Represents the return type of the `UseFileCenterListPage` hook.
 */
export interface UseFileCenterListPageReturn {
  files: FileRecord[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  fetchFiles: (page?: number, size?: number, filters?: Record<string, string | null>) => Promise<void>;
  refreshFiles: () => Promise<void>;
}
