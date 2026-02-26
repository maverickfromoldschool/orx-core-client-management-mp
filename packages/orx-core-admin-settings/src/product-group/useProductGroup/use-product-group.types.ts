import {ProductGroupProps} from '../ProductGroup/product-group.types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseProductGroupProps extends ProductGroupProps {}

/**
 * Represents the return type of the `UseProductGroup` hook.
 */
export interface UseProductGroupReturn {
  value: string;
  onClick: () => void;
}
