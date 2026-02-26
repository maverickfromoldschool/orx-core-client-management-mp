/** Data for a transaction field */
export interface TransactionFieldData {
  /** Unique identifier */
  id: string;
  /** Transaction Attribute */
  transactionAttribute: string;
  /** Label */
  label: string;
  /** Data Type */
  dataType: string;
  /** Unit of Measure */
  unitOfMeasure: string;
  /** Display Sequence */
  displaySequence: number;
  /** Required */
  required: boolean;
  /** Negative Allowed */
  negativeAllowed: boolean;
  /** Summarization */
  summarization: boolean;
  /** Account Usage */
  accountUsage: boolean;
  /** Calculated */
  calculated: boolean;
  /** Notes */
  notes?: string;
}

/** Props for the TransactionFieldDialog component */
export interface TransactionFieldDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should be closed */
  onClose: () => void;
  /** Callback when form is submitted */
  onSave: (data: TransactionFieldData) => void;
  /** Initial data for editing (if not provided, dialog is in add mode) */
  initialData?: TransactionFieldData;
  /** Whether save is currently in progress */
  isSaving?: boolean;
}
