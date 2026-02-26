import {AttributePageProps} from '../AttributePage/attribute-page.types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseAttributePageProps extends AttributePageProps {}

/**
 * Represents the return type of the `UseAttributePage` hook.
 */
export interface UseAttributePageReturn {
  value: string;
  onClick: () => void;
}
