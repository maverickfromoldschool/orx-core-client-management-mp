import {AssignCagListProps} from '../AssignCagList/assign-cag-list.types';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseAssignCagListProps extends AssignCagListProps {}

/**
 * Represents the return type of the `UseAssignCagList` hook.
 */
export interface UseAssignCagListReturn {
  value: string;
  onClick: () => void;
}
