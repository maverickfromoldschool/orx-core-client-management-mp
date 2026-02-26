import {TableRecordDialogProps, TableRowItem} from '../TableRecordDialog/table-record-dialog.types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseTableRecordDialogProps extends TableRecordDialogProps {}

/**
 * Represents the return type of the `UseTableRecordDialog` hook.
 */
export interface UseTableRecordDialogReturn {
  rows: TableRowItem[];
  loading: boolean;
  error: string | null;
  /** Refresh rows. Accepts optional page and size for paged requests. */
  refresh: (page?: number, size?: number) => Promise<void>;
  totalCount: number;
}
