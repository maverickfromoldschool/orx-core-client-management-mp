/**
 * Product Variant Assignment Feature
 *
 * Public exports for the Product Variant Assignment feature.
 */

// Types
export type {
  VariantAssignment,
  VariantAssignmentFormData,
  VariantAssignmentFilters,
  VariantAssignmentResponse,
  BulkActionType,
  SelectionState,
  CreateVariantAssignmentRequest,
  UpdateVariantAssignmentRequest,
  BulkDeleteRequest,
  BulkDeleteResponse,
  GetVariantAssignmentsParams,
  PaginationProps,
  VariantAssignmentHeaderProps,
  GridRowSelectionModel,
  GridRowId
} from './types';

// Services
export {variantAssignmentApiService} from './services';
export type {VariantAssignmentApiService} from './services';

// Constants
export {
  PAGINATION,
  DATE_FORMAT,
  BOOLEAN_DISPLAY,
  TABLE,
  BACKGROUND_COLORS,
  API_RETRY,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FORM_FIELDS,
  COLUMNS,
  DIALOG_MODE,
  DELETE_TARGET,
  LOADING_TIMEOUTS,
  VALIDATION
} from './constants';

// Utilities
export {
  formatDate,
  formatBoolean,
  parseDate,
  isValidDate,
  compareDates,
  hasActiveFilters,
  generatePageNumbers
} from './utils';

// Components
export {
  ProductVariantAssignmentPage,
  VariantAssignmentHeader,
  VariantAssignmentTableHeader,
  VariantAssignmentTable,
  VariantAssignmentFormDialog,
  VariantAssignmentFilterDrawer,
  DeleteConfirmationDialog,
  Pagination
} from './components';

// Hooks
export {useVariantAssignments, type UseVariantAssignmentsOptions} from './hooks/use-variant-assignments';
export {useVariantAssignmentForm} from './hooks/use-variant-assignment-form';
export {useVariantAssignmentSelection} from './hooks/use-variant-assignment-selection';
export {useVariantAssignmentFilters} from './hooks/use-variant-assignment-filters';

// Schemas
export {variantAssignmentSchema, type VariantAssignmentSchemaType} from './schemas';
