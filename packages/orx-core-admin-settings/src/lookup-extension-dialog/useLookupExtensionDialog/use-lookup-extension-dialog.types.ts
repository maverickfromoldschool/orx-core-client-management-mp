import {LookupExtensionDialogProps} from '../LookupExtensionDialog/lookup-extension-dialog.types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseLookupExtensionDialogProps extends LookupExtensionDialogProps {}

/**
 * Represents the return type of the `UseLookupExtensionDialog` hook.
 */
export interface UseLookupExtensionDialogReturn {
  value: string;
  onClick: () => void;
}
