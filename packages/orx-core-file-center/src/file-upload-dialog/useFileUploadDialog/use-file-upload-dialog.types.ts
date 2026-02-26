import {type UploadType} from '../../file-center-list-page/FileCenterListPage/file-center-list-page.types';

/** Minimal hook props to keep backwards compatibility with existing stories/tests */
export interface UseFileUploadDialogProps {
  text?: string;
  uploadType?: UploadType;
}

/**
 * Represents the return type of the `UseFileUploadDialog` hook.
 */
export interface UseFileUploadDialogReturn {
  value: string;
  onClick: () => void;

  // upload control/state
  upload: (files: File[]) => Promise<{success: boolean; data?: any; error?: string}>;
  isUploading: boolean;
  progress: number;
  error?: string | null;
  /** Clear the current upload error (if any) */
  clearError: () => void;
}
