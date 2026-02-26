export type UploadType = 'client' | 'price';

export interface FileRecord {
  uploadHistoryId: string;
  fileName: string;
  uploadStatus: string;
  fileType: string;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  uploadedAt: string;
  uploadedBy: string;
  pendingRecords: number;
}

export interface FileCenterListPageProps {
  title?: string;
  onDelete?: (file: FileRecord) => void;
  openUploadDialog: (uploadType?: UploadType) => void;
  fileTypeFilter?: 'all' | 'client' | 'pricelist';
  searchQuery?: string;
}
