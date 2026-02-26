export interface UomDialogFormData {
  uom: string;
  description: string;
  decimals: number;
  unitTypeCd: string;
  appendToQuantity: string; // 'Y' or 'N'
}

export interface UnitTypeOption {
  value: string;
  label: string;
}

export interface UomDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: UomDialogFormData) => Promise<void>;
  initialData?: UomDialogFormData;
  unitTypeOptions: UnitTypeOption[];
  isSaving?: boolean;
}
