import {ProductGroupData} from '../../components/product-group-types';

export interface DropdownOption {
  label: string;
  value: string;
}

export interface ProductGroupDialogProps {
  open: boolean;
  mode: 'create' | 'edit' | 'copy';
  onClose: () => void;
  onSave: (data: ProductGroupData) => void;
  initialValue?: ProductGroupData;
  isSaving?: boolean;
  productCategoryOptions: DropdownOption[];
  externalSystemOptions: DropdownOption[];
  accountingCodeOptions: DropdownOption[];
  attributeOptions: DropdownOption[];
  variantOptions: DropdownOption[];
  uomOptions: DropdownOption[];
  lookupsLoading?: boolean;
}
