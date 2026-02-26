import {LookupExtensionPageProps} from '../LookupExtensionPage/lookup-extension-page.types';
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UseLookupExtensionPageProps extends LookupExtensionPageProps {}

/**
 * Dropdown option format
 */
export interface DropdownOption {
  label: string;
  value: string;
}

/**
 * Represents the return type of the `UseLookupExtensionPage` hook.
 */
export interface UseLookupExtensionPageReturn {
  // basic demo
  value: string;
  onClick: () => void;

  // api state
  data: Record<string, unknown>[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  loading: boolean;
  error: Error | null;

  // handlers
  onSearchChange: (q: string) => void;
  onPageChange: (p: number) => void;
  refresh: () => void;
  applyFilters: (filters: Record<string, string | number | null>) => void;

  // lookup options
  lookupCodeOptions: DropdownOption[];
  lookupsLoading: boolean;
  dataTypeOptions: DropdownOption[];
  dataTypesLoading: boolean;

  // filters
  filters: Record<string, string | number | null>;
}
