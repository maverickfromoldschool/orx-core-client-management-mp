import type {LookupFieldValue} from '../../services/lookup-api.types';

/** Data for a lookup field */
export interface LookupFieldData {
  /** Lookup field identifier */
  lookupField: string;
  /** Display name */
  displayName: string;
  /** Maximum stored value length */
  maxStoredValueLength: string;
  /** Whether the field stores numeric values */
  numericValue: boolean;
  /** Array of values for this lookup field */
  values?: LookupFieldValue[];
  /** Managed by: 'User' or 'System' */
  managedBy?: string;
}

/** Props for the LookupFieldDialog component */
export interface LookupFieldDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should be closed */
  onClose: () => void;
  /** Callback when form is submitted */
  onSave: (data: LookupFieldData) => void;
  /** Initial data for editing (if not provided, dialog is in add mode) */
  initialData?: LookupFieldData;
  /** Whether save is currently in progress */
  isSaving?: boolean;
}
