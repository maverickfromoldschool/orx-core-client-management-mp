/**
 * Dropdown option format
 */
export interface DropdownOption {
  label: string;
  value: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LookupExtensionDialogProps {
  text: string;
  /** If provided, controls dialog open state */
  open?: boolean;
  /** Optional onClose handler when consumer wants to control closing */
  onClose?: () => void;
  /** Optional initial data to populate the dialog when editing an existing extension */
  initialData?: Record<string, unknown> | null;
  /** Lookup code options for dropdown */
  lookupCodeOptions?: DropdownOption[];
  /** Loading state for lookup codes */
  lookupsLoading?: boolean;
  /** Data Type options for dropdown */
  dataTypeOptions?: DropdownOption[];
  /** Loading state for data types */
  dataTypesLoading?: boolean;
  /** Optional onSave handler called after successful save */
  onSave?: () => void;
}
