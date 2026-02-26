/** Variant value entry */
export interface VariantValueData {
  /** Unique identifier */
  id: string;
  /** Value */
  value: string;
  /** Description */
  description: string;
}

/** Data for a variant */
export interface VariantData {
  /** Unique identifier */
  id: string;
  /** Variant field identifier */
  variantField: string;
  /** Variant name */
  variantName: string;
  /** Data type */
  dataType: string;
  /** Whether the variant is system defined */
  systemDefined: boolean;
  /** Whether the variant is predefined */
  predefined: boolean;
  /** Related entity */
  relatedEntity: string | null;
  /** Attribute value */
  attribute?: string;
  /** Attribute display name */
  attributeName?: string;
  /** Field type */
  fieldType?: string;
  /** Field */
  field?: string;
  /** Notes for the variant */
  notes?: string;
  /** Variant values */
  variantValues?: VariantValueData[];
}

/** Props for the VariantDialog component */
export interface VariantDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should be closed */
  onClose: () => void;
  /** Callback when form is submitted */
  onSave: (data: VariantData) => void;
  /** Initial data for editing (if not provided, dialog is in add mode) */
  initialData?: VariantData;
  /** Whether save is currently in progress */
  isSaving?: boolean;
}
