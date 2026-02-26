import {AttributeFieldDialogProps} from '../AttributeFieldDialog/attribute-field-dialog.types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseAttributeFieldDialogProps extends AttributeFieldDialogProps {}

/**
 * Represents the return type of the `UseAttributeFieldDialog` hook.
 */
export interface UseAttributeFieldDialogReturn {
  value: string;
  onClick: () => void;
}
