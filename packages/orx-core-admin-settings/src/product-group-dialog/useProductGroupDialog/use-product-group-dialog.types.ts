import {ProductGroupDialogProps} from '../ProductGroupDialog/product-group-dialog.types';

export interface UseProductGroupDialogProps extends ProductGroupDialogProps {
  text?: string;
}

/**
 * Represents the return type of the `UseProductGroupDialog` hook.
 */
export interface UseProductGroupDialogReturn {
  value: string;
  onClick: () => void;
}
