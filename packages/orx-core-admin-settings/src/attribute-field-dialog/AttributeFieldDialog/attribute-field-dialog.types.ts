import type {AttributeData} from '../../components/attribute-types';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface AttributeFieldDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** The attribute being edited (null for new attribute) */
  attribute: AttributeData | null;
  /** Callback when dialog is closed */
  onClose: () => void;
  /** Callback when attribute is saved */
  onSave: (attribute: AttributeData) => void;
  /** Data type dropdown options from API */
  dataTypeOptions: DropdownOption[];
  /** Field type dropdown options from API */
  fieldTypeOptions: DropdownOption[];
  /** Field dropdown options from API (separate from field type) */
  fieldOptions: DropdownOption[];
  /** Entity dropdown options from API */
  entityOptions: DropdownOption[];
  /** Whether lookups are still loading */
  lookupsLoading?: boolean;
}
