export interface TableRowItem {
  id?: string | number;
  description?: string;
  [key: string]: any;
}

export interface TableRecordDialogProps {
  /** Title to show in the dialog header */
  title: string;
  /** List of row objects to render (optional). If omitted the component will call the API itself to load rows. */
  rows?: TableRowItem[];
  /** List of fields (label/value) to show as table columns, in order */
  fields?: {label: string; value: string}[];
  /** Optional callback when dialog is closed (consumer-managed) */
  onClose?: () => void;
  /** Backwards-compatible simple text prop (optional) */
  text?: string;
  fileRecord: any;
}
