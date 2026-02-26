import {type UploadType} from '../../file-center-list-page/FileCenterListPage/file-center-list-page.types';

/** Props for the FileUploadDialog component */
export interface FileUploadDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should be closed */
  onClose: () => void;
  /** Callback when files are selected for upload */
  /**
   * Optional callback invoked after an upload attempt completes (success or failure).
   * The dialog performs the upload by default; this callback is a notification hook.
   * If provided, it will be called with the files and a result object describing success or error.
   */
  onUpload?: (files: FileList | File[], result?: {success: boolean; data?: any; error?: string}) => void;
  /** Whether upload is currently in progress */
  isUploading?: boolean;
  /** Upload progress percentage (0-100) */
  uploadProgress?: number;
  /** Upload error message */
  uploadError?: string;
  /** Callback to clear upload error */
  onClearError?: () => void;
  /** Dialog title */
  title?: string;
  /** Accepted file types */
  acceptedTypes?: string[];
  /** Maximum file size in MB */
  maxFileSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Backwards-compatible simple text */
  text?: string;
  /** Upload type (client or price) */
  uploadType?: UploadType;
}
